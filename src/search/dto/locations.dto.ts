import { Info } from "../interfaces/info.interface"

export class LocationsDto {
  info: Info
  results: Location[]
}

export interface Location {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: string
}