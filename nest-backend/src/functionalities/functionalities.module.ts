import { Module } from '@nestjs/common';
import { FunctionalitiesService } from './functionalities.service';
import { FunctionalitiesController } from './functionalities.controller';

@Module({
  controllers: [FunctionalitiesController],
  providers: [FunctionalitiesService]
})
export class FunctionalitiesModule {}
