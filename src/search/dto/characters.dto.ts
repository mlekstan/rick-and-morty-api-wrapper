import { Info } from "../interfaces/info.interface"
import { Resource } from "../interfaces/resource.interface"
import { Result } from "../interfaces/results.interface"

export class CharactersDto implements Resource {
  info: Info
  results: Character[]
}

export interface Character extends Result {
  id: number
  status: string
  species: string
  type: string
  gender: string
  origin: CharacterOrigin
  location: Location
  image: string
  episode: string[]
  created: string
}

export interface CharacterOrigin {
  name: string
  url: string
}

export interface CharacterLocation {
  name: string
  url: string
}