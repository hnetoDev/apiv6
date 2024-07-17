import { TypeOfExercicio } from "@prisma/client"

export class CreateExercicioDto {
  name:string
  desc:string
  category:TypeOfExercicio
}
