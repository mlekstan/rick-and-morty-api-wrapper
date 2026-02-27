import { Test, TestingModule } from '@nestjs/testing';
import { TopPairsController } from './top-pairs.controller';

describe('TopPairsController', () => {
  let controller: TopPairsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopPairsController],
    }).compile();

    controller = module.get<TopPairsController>(TopPairsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
