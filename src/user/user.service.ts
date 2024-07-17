import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService){}



  async create(createUserDto: CreateUserDto,file: Express.Multer.File ) {

    const criaSeguro = this.prismaService.$transaction(async(prisma)=>{

      const user = await prisma.user.create({
        data:{
          ...createUserDto,
          planoId:createUserDto.planoId,
          active:false,
          img:file.filename
        }
      })
      const incPlano = await prisma.plano.update({
        where:{
          id:createUserDto.planoId
        },
        data:{
          qtd:{increment: 1}
        }
      })

      return user
    })





    return criaSeguro
  }

  findAll() {
    return this.prismaService.user.findMany()
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where:{
        id
      }
    });
  }

  search(search: string, status: boolean | undefined ){
    console.log(status);
    if(status !== undefined){
      return this.prismaService.user.findMany({
        where:{
          name:{contains:search,mode:"insensitive"},
          active:status
          
        }
      })
    }
    return this.prismaService.user.findMany({
      where:{
        name:{contains:search,mode:"insensitive"},
        
      }
    })
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const updateSeguro = this.prismaService.$transaction(async(prisma)=>{

      const user = prisma.user.update({
        where:{
          id
        },
        data:{
          ...updateUserDto
        }
      })
      if(updateUserDto.planoId){
        const plano = prisma.plano.update({
          where:{
            id:updateUserDto.planoId
          },
          data:{
            qtd:{increment:1}
          }
        })
      }

      return user
    })

    return updateSeguro
  }

  remove(id: string) {
    
    const delSeguro = this.prismaService.$transaction(async(prisma)=>{
      const user = await prisma.user.delete({
        where:{
          id
        }
      })
      const pathName = path.join(__dirname, "../../public/users/" + user.img );
      const del = fs.unlinkSync(pathName)
      const plano = await prisma.plano.update({
        where:{
          id:user.planoId
        },
        data:{
          qtd:{decrement: 1}
        }
      })

      return user
    })
    return delSeguro
  }


  
}
