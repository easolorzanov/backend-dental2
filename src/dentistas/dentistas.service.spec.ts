import { Test, TestingModule } from '@nestjs/testing';
import { DentistasService } from './dentistas.service';

describe('DentistasService', () => {
  let service: DentistasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DentistasService],
    }).compile();

    service = module.get<DentistasService>(DentistasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
