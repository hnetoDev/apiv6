import { Exercicio } from "@prisma/client";

export class CreateTreinoDto {
  treino:string[][]
  name:string
  treinador:string
}
