import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ApiClientConfig } from './api-client-config.class';

type MakeRequestOptions = {
  method: "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "OPTIONS" | "TRACE" | "CONNECT" | "PATCH",
  headers?: HeadersInit,
  body?: any,
  searchParams?: string[][] | Record<string, string> | string | URLSearchParams,
}

type SchemePortType<T extends ApiClientConfig> = {
  [key in T["scheme"]]: number;
};


@Injectable()
export class ApiClientService {
  private schemePort: SchemePortType<ApiClientConfig> = {
    "http": 80, 
    "https": 443
  }

  constructor(
    @Inject("API_CLIENT") private config: ApiClientConfig 
  ) {}

  async makeRequest<T>(path: string, options: MakeRequestOptions): Promise<T> {
    const { scheme, host, port } = this.config;
    const { method, headers, body, searchParams } = options;

    const selectedPort = port ?? this.schemePort[scheme];
    const searchPramsStr = searchParams ? `?${(new URLSearchParams(searchParams)).toString()}` : "";
    const baseURL = `${scheme}://${host}:${selectedPort}`;
    const fullURL = new URL(`${path}${searchPramsStr}`, baseURL);

    

    const response = await fetch(fullURL, {
      method, 
      headers: headers ?? {}, 
      body: JSON.stringify(body)
    });

    const contentType = response.headers.get("Content-Type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new HttpException(await response.text(), response.status);
    }

    const result = await response.json();
    
    if (!response.ok) {
      const { message = "" } = result ?? {};
      throw new HttpException(`${response.statusText}. ${message}`, response.status);
    }

    return result;
  }
}