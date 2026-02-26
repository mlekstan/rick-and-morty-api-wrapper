import { Info } from "../interfaces/info.interface"

export class CharactersDto {
  info: Info
  results: Character[]
}

export interface Character {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: CharacterOrigin
  location: Location
  image: string
  episode: string[]
  url: string
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