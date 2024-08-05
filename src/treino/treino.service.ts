import { Injectable } from '@nestjs/common';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JsonArray } from '@prisma/client/runtime/library';

@Injectable()
export class TreinoService {
  constructor(private prismaService: PrismaService) { }

  create(createTreinoDto: CreateTreinoDto) {
    const t = createTreinoDto.treino.filter(t => t.length > 0) as JsonArray
    console.log(t)
    return this.prismaService.treino.create({
      data: {
        treinador: createTreinoDto.treinador,
        name:createTreinoDto.name,
        exercicios:t
        
      }
    })

  }

  findAll() {
    return this.prismaService.treino.findMany({})
  }

  findOne(id: string) {
    return this.prismaService.treino.findUnique({
      where: {
        id
      }
    })
  }

  search(search: string) {
    return this.prismaService.treino.findMany({
      where: {
        name: { contains: search, mode: "insensitive" }
      }
    })
  }

  update(id: string, updateTreinoDto: UpdateTreinoDto) {
    return this.prismaService.treino.update({
      where: {
        id
      },
      data: updateTreinoDto
    });
  }

  remove(id: string) {
    return this.prismaService.treino.delete({
      where: {
        id
      }
    });
  }
}
