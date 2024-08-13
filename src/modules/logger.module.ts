import { Module } from '@nestjs/common';
import { CustomLoggerService } from '../services/logger.service';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
