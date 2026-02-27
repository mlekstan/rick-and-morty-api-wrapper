import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller("search")
export class SearchController {
  constructor (private searchService: SearchService) {}

  @Get()
  findAll(@Query("term") term: string, @Query("limit", new ParseIntPipe({ optional: true })) limit?: number) {
    return this.searchService.findAll(term, limit);
  }
}