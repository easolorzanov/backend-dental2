import { Test, TestingModule } from '@nestjs/testing';
import { DentistasController } from './dentistas.controller';
import { DentistasService } from './dentistas.service';

describe('DentistasController', () => {
  let controller: DentistasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DentistasController],
      providers: [DentistasService],
    }).compile();

    controller = module.get<DentistasController>(DentistasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
