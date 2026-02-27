import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { LocationsDto } from './dto/locations.dto';
import { CharactersDto } from './dto/characters.dto';
import { EpisodesDto } from './dto/episodes.dto';
import { Resource } from './interfaces/resource.interface';
import { Result } from './interfaces/results.interface';

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time));

@Injectable()
export class SearchService {
  constructor(private apiClient: ApiClientService) {}


  async findAll(term: string, limit?: number) {

    const [
      characters, 
      locations, 
      episodes
    ] = await Promise.all([
      this.fetchPagesForResource2<CharactersDto>("/api/character", term, limit), 
      this.fetchPagesForResource2<LocationsDto>("/api/location", term, limit), 
      this.fetchPagesForResource2<EpisodesDto>("/api/episode", term, limit) 
    ]);

    const finalList: any[] = [];
    const maxLen = Math.max(characters.length, locations.length, episodes.length);

    for (let i = 0; i < maxLen; i++) {
      if (limit && finalList.length >= limit) break;

      if (characters[i]) {
        finalList.push({ name: characters[i].name, type: 'character', url: characters[i].url });
      }
      if (limit && finalList.length >= limit) break;

      if (locations[i]) {
        finalList.push({ name: locations[i].name, type: 'location', url: locations[i].url });
      }
      if (limit && finalList.length >= limit) break;

      if (episodes[i]) {
        finalList.push({ name: episodes[i].name, type: 'episode', url: episodes[i].url });
      }
    }

    return finalList;
  } 


  async fetchPagesForResource<T extends Resource>(path: string, term: string, limit?: number) {
    const { results: initResults, info } = await this.apiClient.makeRequest<T>(path, {
      method: "GET", 
      searchParams: {
        page: "1", 
        name: term
      }
    });
    
    const count = Math.min(info.count, limit ?? Infinity);
    const pages = Math.ceil(count / 20);
    const finalResults: T["results"] = [...initResults];

    const listOfResults: T["results"][] = [];
    
    const groupSize = 1;
    for (let i = 2; i <= pages; i += groupSize) {
      const groupResultsPromises: Promise<T>[] = [];
      for (let j = i; (j < i + groupSize) && (j <= pages); j++) {
        const resultPromise = this.apiClient.makeRequest<T>(path, {
          method: "GET", 
          searchParams: {
            page: j.toString(), 
            name: term
          }
        });

        groupResultsPromises.push(resultPromise);
      }
      
      listOfResults.push(...(await Promise.all(groupResultsPromises)).map((v) => v.results)) ;
      
      if (i + groupSize <= pages) {
        await wait(500); // waits some time to not block rickandmorty api server
      }
    }

    finalResults.push(...listOfResults.flat()); 
    return finalResults;
  }

  // This function is faster beacause it makes fewer requests. 
  // It is less memory efficient than fetchPagesForResource
  async fetchPagesForResource2<T extends Resource>(path: string, term: string, limit?: number) {
    
    const { results: initResults, info } = await this.apiClient.makeRequest<T>(path, {
      method: "GET", 
      searchParams: { page: "1" }
    });

    let resouceIdsStr = `${initResults.length + 1}`;
    for (let i = initResults.length + 2; i <= info.count; i++) {
      resouceIdsStr += `,${i}`;
    }

    const otherResults = await this.apiClient.makeRequest<T["results"] | Result>(
      `${path}/${resouceIdsStr}`, { method: "GET" }
    );

    const accuResults = [
      ...initResults, 
      ...(Array.isArray(otherResults) ? otherResults : [otherResults])
    ];

    return accuResults.filter((r) => r.name
      .toLowerCase()
      .includes(term.toLowerCase())
    )
    .slice(0, limit ?? Infinity);
  }
}