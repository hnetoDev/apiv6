import { Injectable } from '@nestjs/common';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanoService {
  constructor(private prismaService: PrismaService) { }


  create(createPlanoDto: CreatePlanoDto) {
    return this.prismaService.plano.create({
      data: {
        ...createPlanoDto,

        qtd: 0
      }
    })
  }

  findAll() {
    return this.prismaService.plano.findMany();
  }

  findOne(id: string) {
    return this.prismaService.plano.findUnique({
      where: {
        id
      }
    });
  }

  update(id: string, updatePlanoDto: UpdatePlanoDto) {
    return this.prismaService.plano.update({
      where: {
        id
      },
      data: {
        ...updatePlanoDto
      }
    });
  }

  remove(id: string) {
    return this.prismaService.plano.delete({
      where: {
        id
      }
    });
  }


  teste() {
    const date = new Date()
    const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()]
    const secondsInDay = 86400;
    const secondsActually = seconds + (minutes * 60) + (hour * 60 * 60);

    let timeRest = secondsInDay - secondsActually;
    setInterval(async () => {
      console.log(timeRest)

      const user = await this.prismaService.user.findMany({
        where: {
          active: true
        }
      })

      try {
        if(user){
          user.map(async (u) =>{
            const plano = await this.prismaService.plano.findUnique({
              where:{
                id:u.planoId
              }
            })
            const dateUser = new Date(u.mensalidade)
            dateUser.setDate(dateUser.getDate() + Number(plano.duration))
            console.log(dateUser,date);
            if(dateUser === date){
              const user = await this.prismaService.user.update({
                where:{
                  id:u.id
                },
                data:{
                  active:false
                }
              })
            }
            
          })
        }
      } catch (e) {
        console.log(e)
      }

      timeRest = secondsInDay

    }, 3000)
    console.log(hour, minutes, seconds)

  }








}
