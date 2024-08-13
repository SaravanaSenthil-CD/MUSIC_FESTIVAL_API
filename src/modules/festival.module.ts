import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FestivalService } from '../services/festival.service';
import { FestivalController } from '../controllers/festival.controller';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger.module';

@Module({
  imports: [HttpModule, ConfigModule,LoggerModule],
  providers: [FestivalService],
  controllers: [FestivalController],
})
export class FestivalModule {}
