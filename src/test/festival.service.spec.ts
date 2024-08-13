import { Test, TestingModule } from '@nestjs/testing';
import { FestivalService } from '../services/festival.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../services/logger.service';

describe('FestivalService', () => {
  let service: FestivalService;
  let httpService: HttpService;
  let configService: ConfigService;
  let customLoggerService: CustomLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FestivalService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://mock-api-url'),
          },
        },
        {
          provide: CustomLoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FestivalService>(FestivalService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    customLoggerService = module.get<CustomLoggerService>(CustomLoggerService);
  });

  describe('fetchAndSortFestivals', () => {
    it('should fetch and sort festivals correctly', async () => {
      const mockFestivals = [
        {
          name: 'Festival A',
          bands: [
            { name: 'Band A', recordLabel: 'Label A' },
            { name: 'Band B', recordLabel: 'Label B' },
          ],
        },
        {
          name: 'Festival B',
          bands: [
            { name: 'Band A', recordLabel: 'Label A' },
            { name: 'Band C', recordLabel: 'Label C' },
          ],
        },
      ];

      const axiosResponse: AxiosResponse<any> = {
        data: mockFestivals,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(axiosResponse));

      const result = await service.fetchAndSortFestivals();

      expect(result).toEqual([
        {
          label: 'Label A',
          bands: [
            {
              name: 'Band A',
              festivals: [{ name: 'Festival A' }, { name: 'Festival B' }],
            },
          ],
        },
        {
          label: 'Label B',
          bands: [
            {
              name: 'Band B',
              festivals: [{ name: 'Festival A' }],
            },
          ],
        },
        {
          label: 'Label C',
          bands: [
            {
              name: 'Band C',
              festivals: [{ name: 'Festival B' }],
            },
          ],
        },
      ]);
    });

    it('should retry fetching data if API returns an error', async () => {
      const error = new Error('Temporary error');
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => error));

      await expect(service.fetchAndSortFestivals()).rejects.toThrow(
        new HttpException(
          'Failed to fetch and sort festival data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }, 10000); // Extend timeout to 10s

    it('should throw a TOO_MANY_REQUESTS error if the API returns 429', async () => {
      const error = new Error('Too many requests');
      (error as any).response = { status: 429 };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => error));

      await expect(service.fetchAndSortFestivals()).rejects.toThrow(
        new HttpException(
          'Too many requests, please try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    }, 10000); // Extend timeout to 10s

    it('should throw an error for other HTTP errors', async () => {
      const error = new Error('Internal Server Error');
      (error as any).response = { status: 500 };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => error));

      await expect(service.fetchAndSortFestivals()).rejects.toThrow(
        new HttpException(
          'Failed to fetch and sort festival data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }, 10000); // Extend timeout to 10s
  });

  describe('organizeData', () => {
    it('should correctly organize and sort the data', () => {
      const mockFestivals = [
        {
          name: 'Festival A',
          bands: [
            { name: 'Band B', recordLabel: 'Label B' },
            { name: 'Band A', recordLabel: 'Label A' },
          ],
        },
        {
          name: 'Festival B',
          bands: [{ name: 'Band A', recordLabel: 'Label A' }],
        },
      ];

      const result = service['organizeData'](mockFestivals);

      expect(result).toEqual([
        {
          label: 'Label A',
          bands: [
            {
              name: 'Band A',
              festivals: [{ name: 'Festival A' }, { name: 'Festival B' }],
            },
          ],
        },
        {
          label: 'Label B',
          bands: [
            {
              name: 'Band B',
              festivals: [{ name: 'Festival A' }],
            },
          ],
        },
      ]);
    });
  });
});
