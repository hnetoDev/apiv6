import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs'
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }



  async create(createUserDto: CreateUserDto, file: Express.Multer.File, res: Response) {
    console.log(createUserDto)
    const cpfIgual = this.prismaService.user.findUnique({
      where: {
        cpf: createUserDto.cpf
      }
    })
    const emailIgual = this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email
      }
    })
    const result = await Promise.all([cpfIgual, emailIgual])

    if (result[0] || result[1]) {
      try {
        if (file) {
          const fileRecived = path.join(__dirname, '../../public/users/' + file.filename)
          const fileDelete = fs.unlinkSync(fileRecived)
        }
      } catch (e) {
        console.log(e)
      }
      return res.status(result[0] && result[1] ? 600 : result[0] ? 601 : result[1] ? 602 : 700).send(`${result[0] && result[1] ? 'CPF e EMAIL já registrados' : result[0] ? 'CPF ja registrado' : result[1] ? 'EMAIL ja registrado' : 'Erro no servidor'}`)
    }





    try {
      const criaSeguro = await this.prismaService.$transaction(async (prisma) => {

        const incPlano = prisma.plano.update({
          where: {
            id: createUserDto.planoId
          },
          data: {
            qtd: { increment: 1 }
          }
        })


        const user = prisma.user.create({
          data: {
            ...createUserDto,
            treinoId: createUserDto.treinoId === '' || createUserDto.treinoId === null || createUserDto.treinoId === undefined ? null : createUserDto.treinoId,
            cpf: createUserDto.cpf,
            active: false,
            img: file ? file.filename : null,
            createdAt: createUserDto.mensalidade ?? null,
            mensalidade: createUserDto.mensalidade ?? null,
            planoId: createUserDto.planoId === '' || createUserDto.planoId === null || createUserDto.planoId === undefined ? null : createUserDto.planoId,
          }
        })


        if (createUserDto.planoId === '' || createUserDto.planoId === null || createUserDto.planoId === undefined) {
          console.log('aluno sem plano')
          return await Promise.resolve(user)
        }
        console.log('aluno com plano')
        return await Promise.all([user, incPlano]);





      }, { isolationLevel: 'ReadCommitted' })
      return res.json(criaSeguro[0]).status(201)


    } catch (e) {
      console.log(e)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002':
          case 'P2034':
            throw new HttpException('Algum campo já está registrado', HttpStatus.CONFLICT);
        }
      }
      throw new HttpException('Erro desconhecido', HttpStatus.FAILED_DEPENDENCY)

    }


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
        if (updateUserDto.planoId !== '' && updateUserDto.planoId !== null && updateUserDto.planoId !== undefined) {
          if (updateUserDto.planoId !== userPrev.planoId) {
            const plano = prisma.plano.update({
              where: {
                id: updateUserDto.planoId
              },
              data: {
                qtd: { increment: 1 }
              }
            })
            try {
              const planoPrev = prisma.plano.update({
                where: {
                  id: userPrev.planoId
                },
                data: {
                  qtd: { decrement: 1 }
                }
              })
              const planos = await Promise.all([plano, planoPrev])
            } catch (e) {
              console.log(e)
            }
          }
        }
        try {
          if (file && userPrev.img) {
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
            img: file ? file.filename : userPrev.img,
            planoId: updateUserDto.planoId === null || updateUserDto.planoId === '' || updateUserDto.planoId === undefined ? userPrev.planoId : updateUserDto.planoId,
            treinoId: updateUserDto.treinoId === null || updateUserDto.treinoId === '' || updateUserDto.treinoId === undefined ? userPrev.treinoId : updateUserDto.treinoId
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
      console.log(user)
      if (user.planoId) {
        console.log(user.planoId)
        console.log('tem plano')
        const plano = await prisma.plano.update({
          where: {
            id: user.planoId
          },
          data: {
            qtd: { decrement: 1 }
          }
        })
      }

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




  async authMobile(authBody: { email: string, password: string }) {

    const user = await this.prismaService.user.findUnique({
      where: {
        email: authBody.email,
        password: authBody.password
      }
    })
    if (!user) {
      throw new HttpException('Credenciais Incorretas', HttpStatus.NO_CONTENT)
    }
    return user

  }


}
