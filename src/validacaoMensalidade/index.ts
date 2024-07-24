import { PrismaService } from "src/prisma/prisma.service";

export class ValidacaoMensalidade{
  constructor(private prismaServices:PrismaService){}






  verificacao(){
    const getTime = new Date().getTime();
    console.log(getTime)


  }
}