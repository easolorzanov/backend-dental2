import { Test, TestingModule } from '@nestjs/testing';
import { HistorialClinicoController } from './historial-clinico.controller';
import { HistorialClinicoService } from './historial-clinico.service';

describe('HistorialClinicoController', () => {
  let controller: HistorialClinicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialClinicoController],
      providers: [HistorialClinicoService],
    }).compile();

    controller = module.get<HistorialClinicoController>(HistorialClinicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
