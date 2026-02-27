import { Test, TestingModule } from '@nestjs/testing';
import { TopPairsService } from './top-pairs.service';

describe('TopPairsService', () => {
  let service: TopPairsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopPairsService],
    }).compile();

    service = module.get<TopPairsService>(TopPairsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
