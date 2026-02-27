import { Injectable } from '@nestjs/common';
import { ApiClientService } from 'src/api-client/api-client.service';
import { Character, CharactersDto } from 'src/search/dto/characters.dto';
import { PairDto } from './dto/pair.dto';
import { EpisodesDto } from 'src/search/dto/episodes.dto';

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

@Injectable()
export class TopPairsService {
  constructor(private apiClient: ApiClientService) {}


  async findAllFirstApproach(min?: number, max?: number, limit?: number) {

    let pairs: PairDto[] = [];

    const { results: partialResults, info } = await this.apiClient.makeRequest<CharactersDto>("/api/character", {
      method: "GET", 
      searchParams: {
        page: "1", 
      }
    }); 

    let str = `${partialResults.length + 1}`
    for (let i = partialResults.length + 2; i <= info.count; i++) {
      str += `,${i}`;
    }

    const otherResults = await this.apiClient.makeRequest<CharactersDto["results"] | Character>(`/api/character/${str}`, {
      method: "GET", 
    });

    const accuResults = [
      ...partialResults, 
      ...(Array.isArray(otherResults) ? otherResults : [otherResults])
    ];

    for (let i = 0; i < accuResults.length - 1; i++) {
      const name1 = accuResults[i].name;
      const url1 = accuResults[i].url;
      const episodes1 = accuResults[i].episode;
      const setOfEpisodes1 = new Set(episodes1);

      for (let j = i + 1; j < accuResults.length; j++) {
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
    
    return (pairs.sort((p1, p2) => p2.episodes - p1.episodes).slice(0, limit ?? 20));
  }


  async findAllSecondApproach(min?: number, max?: number, limit?: number): Promise<PairDto[]> {
    
    let accuResults: EpisodesDto["results"] = [];
    let page = 1;
    while (page) {
      const { results, info } = await this.apiClient.makeRequest<EpisodesDto>("/api/episode", {
        method: "GET", 
        searchParams: { page: page.toString() }
      });

      page = info.next ? (page + 1) : 0;
      accuResults.push(...results);
      
      // if (page)
      //   await wait(500); // to not overload rickandmorty api server
    }

    const idCountDict: Record<string, number> = {};

    for (let i = 0; i < accuResults.length; i++) {
      const charactersURLs = accuResults[i].characters;

      for (let j = 0; j < charactersURLs.length - 1; j++) {
        const url1 = charactersURLs[j];
        for (let k = j + 1; k < charactersURLs.length; k++) {
          const url2 = charactersURLs[k];
          const id = url1 < url2 ? `${url1}~${url2}` : `${url2}~${url1}`;
          idCountDict[id] = (idCountDict[id] ?? 0) + 1;
        }
      }
    }


    const filteredCounts = Object.entries(idCountDict).filter(
      (c) => (
        (c[1] >= (min ?? -Infinity)) && (c[1] <= (max ?? Infinity))
      )
    );
    const sortedCounts = filteredCounts.sort((c1, c2) => c2[1] - c1[1]);
    const limitedSortedCounts = sortedCounts.slice(0, limit ?? 20);

    if (limitedSortedCounts.length === 0) return [];

    const charIdsSet = new Set<string>();
    limitedSortedCounts.forEach((c) => {
      const id = c[0]; // id in format: `${url1}~${url2}`
      const [url1, url2] = id.split("~");
      charIdsSet.add(url1.split("/").at(-1)!);
      charIdsSet.add(url2.split("/").at(-1)!);
    });

    const charIdsStr = Array.from(charIdsSet).join(",");
    const charResults = await this.apiClient.makeRequest<CharactersDto["results"]>(
      `/api/character/${charIdsStr}`, 
      { method: "GET" }
    );

    const urlNameDict: Record<string, string> = {};
    charResults.forEach(charResult => urlNameDict[charResult.url] = charResult.name);

    return limitedSortedCounts.map(c => {
      const id = c[0];
      const [url1, url2] = id.split("~");

      return ({
        character1: {
          name: urlNameDict[url1], 
          url: url1
        }, 
        character2: {
          name: urlNameDict[url2], 
          url: url2
        }, 
        episodes: c[1]
      })
    }); 
  }
}