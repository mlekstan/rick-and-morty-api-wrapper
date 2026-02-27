import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { TopPairsService } from './top-pairs.service';

@Controller("top-pairs")
export class TopPairsController {
  constructor(private topPairsService: TopPairsService) {}

  @Get()
  findAll(
    @Query("min", new ParseIntPipe({ optional: true })) min?: number, 
    @Query("max", new ParseIntPipe({ optional: true })) max?: number, 
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number
  ) {
    // return this.topPairsService.findAllFirstApproach(min, max, limit);
    return this.topPairsService.findAllSecondApproach(min, max, limit); 
  }
}