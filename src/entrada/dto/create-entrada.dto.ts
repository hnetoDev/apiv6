import { Method } from "@prisma/client"

export class CreateEntradaDto {
  name:string
  method:Method
  date:string
  userId:string
  month:number
  planoId:string
  active:boolean
  
}
