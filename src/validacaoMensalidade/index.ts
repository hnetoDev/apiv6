import { PrismaService } from "src/prisma/prisma.service";

export class ValidacaoMensalidade{
  constructor(private prismaServices:PrismaService){}
  verificacao(){
    const time = 35000;

    setInterval(async()=>{
      const hour = new Date().getHours()
      if(hour === 1){
        const users = await this.prismaServices.user.findMany({
          where:{
            active:true
          } 
        }); 
        users.map(async(u) =>{
          const plano = await this.prismaServices.plano.findUnique({
            where:{
              id:u.planoId
            }
          })
          const planoDuration = Number(plano.duration);
         
        });
      }
    },time)
  }
}