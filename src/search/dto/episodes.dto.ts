import { Info } from "../interfaces/info.interface"

export interface EpisodesDto {
  info: Info
  results: Episode[]
}

export interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}