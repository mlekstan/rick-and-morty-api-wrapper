import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { LocationsDto } from './dto/locations.dto';
import { CharactersDto } from './dto/characters.dto';
import { EpisodesDto } from './dto/episodes.dto';

@Injectable()
export class SearchService {
  constructor(private apiClient: ApiClientService) {}

  async findAll(term: string, limit: number) {

  }
}
