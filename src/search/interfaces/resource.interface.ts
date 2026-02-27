import { Info } from "./info.interface";
import { Result } from "./results.interface";

export interface Resource {
  info: Info
  results: Result[]
}