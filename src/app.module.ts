import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EntradaModule } from './entrada/entrada.module';
import { PlanoModule } from './plano/plano.module';
import { ExercicioModule } from './exercicio/exercicio.module';
import { TreinoModule } from './treino/treino.module';


@Module({
  imports: [UserModule, EntradaModule, PlanoModule, ExercicioModule, TreinoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
