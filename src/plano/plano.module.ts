import { Module } from '@nestjs/common';
import { PlanoService } from './plano.service';
import { PlanoController } from './plano.controller';

@Module({
  controllers: [PlanoController],
  providers: [PlanoService],
})
export class PlanoModule {}
