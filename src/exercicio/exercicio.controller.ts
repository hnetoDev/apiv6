import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ExercicioService } from './exercicio.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from 'src/config/multer.configEx';
import { TypeOfExercicio } from '@prisma/client';

@Controller('exercicio')
export class ExercicioController {
  constructor(private readonly exercicioService: ExercicioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img',multerOptions))
  create(@Body() createExercicioDto: CreateExercicioDto, @UploadedFile() file: Express.Multer.File) {
    return this.exercicioService.create(createExercicioDto,file)
  }

  @Get()
  findAll() {
    return this.exercicioService.findAll();
  }

  @Post('search')
  search(@Body() search:{search:string,category:TypeOfExercicio|undefined}){
    console.log("no search")
    return this.exercicioService.search(search)
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercicioService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('img',multerOptions))
  update(@Param('id') id: string, @Body() updateExercicioDto: UpdateExercicioDto,@UploadedFile() file: Express.Multer.File) {
    return this.exercicioService.update(id, updateExercicioDto,file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercicioService.remove(id);
  }
}
