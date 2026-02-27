import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { ApiClientModule } from './api-client/api-client.module';
import { TopPairsModule } from './top-pairs/top-pairs.module';

@Module({
  imports: [SearchModule, ApiClientModule, TopPairsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}