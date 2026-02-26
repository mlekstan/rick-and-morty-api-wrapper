export class ApiClientConfig {
  constructor(
    public scheme: "http" | "https",
    public host: string, 
    public port?: number
  ) {}
}