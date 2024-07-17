import { Injectable } from '@nestjs/common';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanoService {
  constructor(private prismaService: PrismaService){}


  create(createPlanoDto: CreatePlanoDto) {
    return this.prismaService.plano.create({
      data:{
        ...createPlanoDto,
      
        qtd:0
      }
    })
  }

  findAll() {
    return this.prismaService.plano.findMany();
  }

  findOne(id: string) {
    return this.prismaService.plano.findUnique({
      where:{
        id
      }
    });
  }

  update(id: string, updatePlanoDto: UpdatePlanoDto) {
    return this.prismaService.plano.update({
      where:{
        id
      },
      data:{
        ...updatePlanoDto
      }
    });
  }

  remove(id: string) {
    return this.prismaService.plano.delete({
      where:{
        id
      }
    });
  }
}
