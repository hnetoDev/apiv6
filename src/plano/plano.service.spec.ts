import { Test, TestingModule } from '@nestjs/testing';
import { PlanoService } from './plano.service';

describe('PlanoService', () => {
  let service: PlanoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanoService],
    }).compile();

    service = module.get<PlanoService>(PlanoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
