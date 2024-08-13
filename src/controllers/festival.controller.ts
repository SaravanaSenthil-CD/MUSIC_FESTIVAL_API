import { Controller, Get } from '@nestjs/common';
import { FestivalService } from '../services/festival.service';
import { CustomLoggerService } from '../services/logger.service';

@Controller('festivals')
export class FestivalController {
  constructor(
    private readonly festivalService: FestivalService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Get()
  async fetchAndStoreFestivals() {
    this.logger.log(
      'Handling request to fetch and sort alphabetically the festivals data',
    );
    try {
      const data = await this.festivalService.fetchAndSortFestivals();
      return { message: 'Data fetched and sorted successfully', data };
    } catch (error) {
      this.logger.error(
        'Failed to fetch and sort alphabetically the festivals data',
        error.stack,
      );
      throw new Error(
        'Failed to fetch and sort alphabetically the festivals data',
      );
    }
  }
}
