import { Module } from '@nestjs/common';
import { TopPairsController } from './top-pairs.controller';
import { TopPairsService } from './top-pairs.service';

@Module({
  controllers: [TopPairsController],
  providers: [TopPairsService]
})
export class TopPairsModule {}
