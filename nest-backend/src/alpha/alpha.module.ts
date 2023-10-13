import { Module } from '@nestjs/common';
import { AlphaController } from './alpha.controller';
import { AlphaService } from './alpha.service';

@Module({
  controllers: [AlphaController],
  providers: [AlphaService]
})
export class AlphaModule {}
