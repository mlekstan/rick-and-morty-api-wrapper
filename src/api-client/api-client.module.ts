import { Global, Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiClientConfig } from './api-client-config.class';

@Global()
@Module({
  providers: [
    ApiClientService, 
    {
      provide: "API_CLIENT", 
      useValue: new ApiClientConfig("https", "rickandmortyapi.com")
    }
  ], 
  exports: [ApiClientService]
})
export class ApiClientModule {}