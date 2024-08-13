import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, retryWhen, delay, take, tap } from 'rxjs/operators';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from './logger.service';

dotenv.config();

@Injectable()
export class FestivalService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

  async fetchAndSortFestivals() {
    const retryAttempts = 3;
    const retryDelay = 3000;

    const apiUrl = this.configService.get<string>('URL');

    try {
      this.logger.log('Fetching festival data from API', FestivalService.name);
      const response = await this.httpService
        .get(apiUrl)
        .pipe(
          retryWhen((errors) =>
            errors.pipe(
              tap((error) => {
                if (error.response?.status === 429) {
                  throw new HttpException(
                    'Too many requests, please try again later.',
                    HttpStatus.TOO_MANY_REQUESTS,
                  );
                }
                this.logger.warn(
                  'Retrying after delay...',
                  FestivalService.name,
                );
              }),
              delay(retryDelay),
              take(retryAttempts),
            ),
          ),
          catchError((error) => {
            if (error instanceof HttpException) {
              throw error;
            }
            this.logger.error(
              'Error fetching festival data',
              error.stack,
              FestivalService.name,
            );
            throw new HttpException(
              'Failed to fetch festival data',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        )
        .toPromise();

      const festivalsData = response.data;

      this.logger.log(
        'Processing and sorting alphabetically festival data',
        FestivalService.name,
      );
      const sortedData = this.organizeData(festivalsData);

      this.logger.log(
        'Festival data sorted alphabetically successfully',
        FestivalService.name,
      );
      return sortedData;
    } catch (error) {
      this.logger.error(
        'Failed to fetch and sort alphabetically festival data',
        error.stack,
        FestivalService.name,
      );
      throw error instanceof HttpException
        ? error
        : new HttpException(
            'Failed to fetch and sort alphabetically festival data',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
    }
  }

  private organizeData(festivalsData: any[]): any[] {
    const recordLabelsMap = new Map<string, any>();

    for (const festival of festivalsData) {
      for (const band of festival.bands) {
        if (!recordLabelsMap.has(band.recordLabel)) {
          recordLabelsMap.set(band.recordLabel, {
            label: band.recordLabel || '',
            bands: [],
          });
        }
        const recordLabel = recordLabelsMap.get(band.recordLabel);
        let bandEntry = recordLabel.bands.find((b) => b.name === band.name);

        if (!bandEntry) {
          bandEntry = { name: band.name || '', festivals: [] };
          recordLabel.bands.push(bandEntry);
        }
        if (
          festival.name &&
          !bandEntry.festivals.some((f) => f.name === festival.name)
        ) {
          bandEntry.festivals.push({
            name: festival.name || '',
          });
        }
      }
    }

    const sortedRecordLabels = Array.from(recordLabelsMap.values()).sort(
      (a, b) => {
        if (a.label === '') return 1;
        if (b.label === '') return -1;
        return a.label.localeCompare(b.label);
      },
    );

    for (const recordLabel of sortedRecordLabels) {
      recordLabel.bands.sort((a, b) => {
        if (a.name === '') return 1;
        if (b.name === '') return -1;
        return a.name.localeCompare(b.name);
      });
      for (const band of recordLabel.bands) {
        band.festivals.sort((a, b) => {
          if (a.name === '') return 1;
          if (b.name === '') return -1;
          return a.name.localeCompare(b.name);
        });
      }
    }

    return sortedRecordLabels;
  }
}
