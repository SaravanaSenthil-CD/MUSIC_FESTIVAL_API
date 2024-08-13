import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { FestivalModule } from '../modules/festival.module';
import { FestivalService } from '../services/festival.service';
import { FestivalController } from '../controllers/festival.controller';

describe('FestivalModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [FestivalModule, HttpModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide FestivalService', () => {
    const service = module.get<FestivalService>(FestivalService);
    expect(service).toBeDefined();
  });

  it('should provide FestivalController', () => {
    const controller = module.get<FestivalController>(FestivalController);
    expect(controller).toBeDefined();
  });
});
