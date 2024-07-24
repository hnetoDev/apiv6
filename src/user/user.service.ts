import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }



  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {

    const criaSeguro = this.prismaService.$transaction(async (prisma) => {

      const incPlano = prisma.plano.update({
        where: {
          id: createUserDto.planoId
        },
        data: {
          qtd: { increment: 1 }
        }
      })
      if (!file) {
        console.log('n file')
        const user = prisma.user.create({
          data: {
            active: false,
            ...createUserDto,
            img: null,

          }
        })

        Promise.all([user, incPlano])
        return user;

      }
      console.log(createUserDto)

      const user = prisma.user.create({
        data: {
          ...createUserDto,
          planoId: createUserDto.planoId,
          active: false,
          img: file.filename,

        }
      })


      Promise.all([user, incPlano])

      return user
    })





    return criaSeguro
  }

  findAll() {
    return this.prismaService.user.findMany()
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id
      }
    });
  }

  search(search: string, status: boolean | undefined) {
    console.log(status);
    if (status !== undefined) {
      return this.prismaService.user.findMany({
        where: {
          name: { contains: search, mode: "insensitive" },
          active: status

        }
      })
    }
    return this.prismaService.user.findMany({
      where: {
        name: { contains: search, mode: "insensitive" },

      }
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    console.log("try update user")
    console.log(updateUserDto)

    try {

      const userPrev = await this.prismaService.user.findUnique({
        where: {
          id
        }
      })

      const updateSeguro = this.prismaService.$transaction(async (prisma) => {

        console.log(userPrev.planoId)
        console.log(updateUserDto.planoId)
        if (updateUserDto.planoId !== userPrev.planoId) {
          const plano = prisma.plano.update({
            where: {
              id: updateUserDto.planoId
            },
            data: {
              qtd: { increment: 1 }
            }
          })
          const planoPrev = prisma.plano.update({
            where: {
              id: userPrev.planoId
            },
            data: {
              qtd: { decrement: 1 }
            }
          })
          const planos = await Promise.all([plano, planoPrev])

        }
        if (!file) {
          return prisma.user.update({
            where: {
              id
            },
            data: {
              ...updateUserDto,
              img: userPrev.img
            }
          })
        }
        try {
          if (userPrev.img) {
            const pathName = path.join(__dirname, '../../public/users/' + userPrev.img)
            fs.unlinkSync(pathName)
          }
        } catch (e) {
          console.log(e)
        }

        return prisma.user.update({
          where: {
            id
          },
          data: {
            ...updateUserDto,
            img: file.filename
          }
        })



      }, { isolationLevel: "ReadCommitted" })
      return updateSeguro

    } catch (e) {
      console.log(e)
    }

  }

  async remove(id: string) {

    const delSeguro = await this.prismaService.$transaction(async (prisma) => {

      const user = await prisma.user.delete({
        where: {
          id
        }
      })
      /* if (user.img) {
        const pathName = path.join(__dirname, "../../public/users/" + user.img);
        const del = fs.statSync(pathName)
        if (del.isDirectory) {
          fs.unlinkSync(pathName)
        }
      } */

      const plano = await prisma.plano.update({
        where: {
          id: user.planoId
        },
        data: {
          qtd: { decrement: 1 }
        }
      })

      return user
    })
    if (delSeguro.img) {
      try {
        console.log('try delete img')
        const pathName = path.join(__dirname, '../../public/users/' + delSeguro.img)
        const del = fs.unlinkSync(pathName)
      } catch (e) {
        console.log(e)
      }
    }
    return delSeguro
  }



}
