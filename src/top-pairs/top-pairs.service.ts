import { Injectable } from '@nestjs/common';
import { ApiClientService } from 'src/api-client/api-client.service';
import { CharactersDto } from 'src/search/dto/characters.dto';
import { PairDto } from './dto/pair.dto';

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

@Injectable()
export class TopPairsService {
  constructor(private apiClient: ApiClientService) {}

  async findAll(min?: number, max?: number, limit?: number) {

    let pairs: PairDto[] = [];

    let accuResults: CharactersDto["results"] = [];
    let newStart = 0;
    let page = 1;

    while (page) {

      const { results: partialResults, info } = await this.apiClient.makeRequest<CharactersDto>("/api/character", {
        method: "GET", 
        searchParams: {
          page: page.toString(), 
        }
      });

      page = info.next ? page + 1 : 0;
      accuResults = [...accuResults, ...partialResults];

      for (let i = 0; i < accuResults.length - 1; i++) {
        const name1 = accuResults[i].name;
        const url1 = accuResults[i].url;
        const episodes1 = accuResults[i].episode;
        const setOfEpisodes1 = new Set(episodes1);

        for (let j = Math.max(i + 1, newStart); j < accuResults.length; j++) {
          const name2 = accuResults[j].name;
          const url2 = accuResults[j].url;
          const episodes2 = accuResults[j].episode;
          
          const commonEpisodes = episodes2.filter((e) => setOfEpisodes1.has(e));
          const numberOfCommonEpisodes = commonEpisodes.length;

          if (
            numberOfCommonEpisodes > 0 && 
            (min === undefined || numberOfCommonEpisodes >= min) && 
            (max === undefined || numberOfCommonEpisodes <= max)
          ) {
            pairs.push({
              character1: {
                name: name1, 
                url: url1
              }, 
              character2: {
                name: name2, 
                url: url2
              }, 
              episodes: numberOfCommonEpisodes
            });
          }

        }
      } 
      
      newStart = accuResults.length;
      await wait(500); // to not overload rickendmorty api server
    }

    return (pairs.sort((p1, p2) => p2.episodes - p1.episodes).slice(0, limit ?? 20));
  }
}
