import { Injectable } from '@nestjs/common';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EntradaService {

  constructor(private prismaService: PrismaService){}

  async create(createEntradaDto: CreateEntradaDto) {


    try{
  
      const payment = await this.prismaService.$transaction(async(prisma)=>{

        const plano = await prisma.plano.findUnique({
          where:{
            id:createEntradaDto.planoId
          }
        })

        const user = prisma.user.update({
          where:{
            id:createEntradaDto.userId
          },
          data:{
            active:createEntradaDto.active
          }
        })
        const entrada = prisma.entrada.create({
          data:{
            month:createEntradaDto.month,
            planoId:createEntradaDto.planoId,
            userId:createEntradaDto.userId,
            name:createEntradaDto.name,
            method:createEntradaDto.method,
            date:createEntradaDto.date,
            value:plano.value
          }
        })

        const promises = await Promise.all([entrada,user])

        return promises;

      },{isolationLevel:"ReadCommitted"}) 

      return payment
    }catch(e){
      console.log(e)
    }
  
   
    
  }

  findAll() {
    return this.prismaService.entrada.findMany({})
  }

  async findMonthly(month: number){
    const EntradasMonth = await this.prismaService.entrada.findMany({
      where:{
        month
      }
    })
    

    let appValue = 0;
    const app = EntradasMonth.map(e => {
      if(e.method === "aplicativo"){
        return appValue += Number(e.value);
      } 
      return
    })
    
    let pixValue = 0;
    const pix = EntradasMonth.map(e => {
      if(e.method === "pix"){
        return pixValue += Number(e.value);
pix } 
      return
    })

    let dinheiroValue = 0;
    const dinheiro = EntradasMonth.map(e => {
      if(e.method === "dinheiro"){
        return dinheiroValue += Number(e.value);
      } 
      return
    })

    return {
      "dinheiro":dinheiroValue,
      "pix":pixValue,
      "aplicativo":appValue,
      "entradas":[...EntradasMonth]
    }
  }

  findOne(id: string) {
    return this.prismaService.entrada.findUnique({
      where:{
        id
      }
    })
  }

  update(id: string, updateEntradaDto: UpdateEntradaDto) {
    return this.prismaService.entrada.update({
      where:{
        id
      },
      data:{
        ...updateEntradaDto
      }
    })
  }

  remove(id: string) {
    return this.prismaService.entrada.delete({
      where:{
        id
      }
    })
  }

  async caixa(){
  
    const entradas = await this.prismaService.entrada.findMany();
    const month : Array<number> = [];
    let soma = 0;
    for(let i = 0; i<12;i++){
     entradas.filter(d =>{
        if(d.month === i){
          soma += Number(d.value)
        }
      })
      month[i] = soma

      soma = 0;
    } 
  
    return month
  }
}
