import { Info } from "../interfaces/info.interface"
import { Resource } from "../interfaces/resource.interface"
import { Result } from "../interfaces/results.interface"

export class EpisodesDto implements Resource {
  info: Info
  results: Episode[]
}

export interface Episode extends Result {
  id: number
  air_date: string
  episode: string
  characters: string[]
  created: string
}