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
      const user = await this.prismaService.user.findMany({
        where: {
          active: true
        }
      })

      try {
        if (user) {
          user.map(async (u) => {
            const plano = await this.prismaService.plano.findUnique({
              where: {
                id: u.planoId
              }
            })

            const dateUser: string | Date = new Date(u.mensalidade)
            console.log(u.mensalidade)

            dateUser.setDate(dateUser.getDate() + 1 + Number(plano.duration));
            const dateD = dateUser.getDate() 
            const dateM = dateUser.getMonth() 
            const dateY = dateUser.getFullYear() 
            const dateNowD = new Date().getDate()
            const dateNowM = new Date().getMonth()

            console.log(dateD,dateM,'------------',dateNowD,dateNowM)
            console.log(`${dateY}-${dateM}-${dateD}`)

           


            if (`${dateD}-${dateM}` === `${dateNowD}-${dateNowM}`) {
              const dataFormated = `${dateY}-${dateM > 10 ? (dateM + 1) : `0${dateM + 1}`}-${dateD > 10 ? dateD : `0${dateD}`}`
              console.log(dataFormated)
              const user = await this.prismaService.user.update({
                where: {
                  id: u.id
                },
                data: {
                  active: false,
                  mensalidade: dataFormated
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
