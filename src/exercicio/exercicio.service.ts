import { Injectable } from '@nestjs/common';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import path from 'path';
import fs from 'fs'
import { TypeOfExercicio } from '@prisma/client';


@Injectable()
export class ExercicioService {
  constructor(private prismaService: PrismaService){}
  
  create(createExercicioDto: CreateExercicioDto,file: Express.Multer.File ) {
    return this.prismaService.exercicio.create({
      data:{
        name:createExercicioDto.name,
        desc:createExercicioDto.desc,
        category:createExercicioDto.category,
        img:file.filename
      }
    });
  }


  search(search:{search:string,category:TypeOfExercicio|undefined}){
    console.log(search.category)
    if(search.category !== undefined){
      return this.prismaService.exercicio.findMany({
        where:{
          name:{
            contains:search.search,
            mode:"insensitive"
          },
          category:search.category
  
        }
      })
    }
    return this.prismaService.exercicio.findMany({
      where:{
        name:{
          contains:search.search,
          mode:"insensitive"
        },
      
      }
    })
  }

  findAll() {
    return this.prismaService.exercicio.findMany({});
  }

  findOne(id: string) {
    return this.prismaService.exercicio.findUnique({
      where:{
        id
      }
    });
  }

  update(id: string, updateExercicioDto: UpdateExercicioDto) {
    return this.prismaService.exercicio.update({
      where:{
        id
      },
      data:updateExercicioDto
    })
  }

  async remove(id: string){
    const exercicio = await this.prismaService.exercicio.delete({
      where:{
        id
      }
    })
    const pathName = path.join(__dirname, "../../public/exercicios/" + exercicio.img );
    const del = fs.unlinkSync(pathName)

    return exercicio;
  }
}
