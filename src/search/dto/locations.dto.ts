import { Info } from "../interfaces/info.interface"
import { Resource } from "../interfaces/resource.interface"
import { Result } from "../interfaces/results.interface"

export class LocationsDto implements Resource {
  info: Info
  results: Location[]
}

export interface Location extends Result {
  id: number
  type: string
  dimension: string
  residents: string[]
  created: string
}