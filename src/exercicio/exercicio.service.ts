import { Injectable } from '@nestjs/common';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs'




import { TypeOfExercicio } from '@prisma/client';


@Injectable()
export class ExercicioService {
  constructor(private prismaService: PrismaService) { }

  create(createExercicioDto: CreateExercicioDto, file: Express.Multer.File) {
    console.log(createExercicioDto, file)

    return this.prismaService.exercicio.create({
      data: {
        name: createExercicioDto.name,
        desc: createExercicioDto.desc,
        category: createExercicioDto.category,
        img: file ? file.filename : null
      }
    });
  }


  search(search: { search: string, category: TypeOfExercicio | undefined | string }) {
    console.log(search.category)
    if (search.category !== undefined && search.category !== "Todas Categorias") {
      return this.prismaService.exercicio.findMany({
        where: {
          name: {
            contains: search.search,
            mode: "insensitive"
          },
          category: search.category as TypeOfExercicio

        }
      })
    }
    return this.prismaService.exercicio.findMany({
      where: {
        name: {
          contains: search.search,
          mode: "insensitive"
        },

      }
    })
  }

  findAll() {
    return this.prismaService.exercicio.findMany({});
  }

  findOne(id: string) {
    return this.prismaService.exercicio.findUnique({
      where: {
        id
      }
    });
  }

  update(id: string, updateExercicioDto: UpdateExercicioDto, file: Express.Multer.File) {
    console.log(file)

    if (file) {
      const fileDelete = this.prismaService.exercicio.findUnique({
        where: {
          id
        }
      }).then(f => {
        if (f.img) {
          try{
            const pathName = path.join(__dirname, "../../public/exercicios/", f.img);
            const del = fs.unlinkSync(pathName)
          }catch(e){
            console.log(e)
          }
        }
        return f
      })

      const exercicio = this.prismaService.exercicio.update({
        where: {
          id
        },
        data: {
          name: updateExercicioDto.name,
          desc: updateExercicioDto.desc,
          category: updateExercicioDto.category,
          img: file.filename

        }
      })
      return Promise.all([exercicio,fileDelete])

    }
    return this.prismaService.exercicio.update({
      where: {
        id
      },
      data: {
        name: updateExercicioDto.name,
        desc: updateExercicioDto.desc,
        category: updateExercicioDto.category,

      }
    })
  }

  async remove(id: string) {
    const exercicio = await this.prismaService.exercicio.delete({
      where: {
        id
      }
    })

    const pathName = path.join(__dirname, "../../public/exercicios/", exercicio.img);
    const del = fs.unlinkSync(pathName)


    return exercicio;
  }
}
