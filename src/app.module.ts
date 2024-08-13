import { Module } from '@nestjs/common';
import { FestivalModule } from './modules/festival.module';
import { LoggerModule } from './modules/logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, FestivalModule, LoggerModule],
})
export class AppModule {}
