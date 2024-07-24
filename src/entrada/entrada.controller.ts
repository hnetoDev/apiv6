import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntradaService } from './entrada.service';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { TypeOfExercicio } from '@prisma/client';

@Controller('entrada')
export class EntradaController {
  constructor(private readonly entradaService: EntradaService) {}

  @Post()
  create(@Body() createEntradaDto: CreateEntradaDto) {
    return this.entradaService.create(createEntradaDto);
  }

  @Get()
  findAll() {
    return this.entradaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entradaService.findOne(id);
  }

  @Get('user/:id')
  entradaFilter(@Param('id') id: string){
    return this.entradaService.entradaFilter(id)
  }
  
 

  @Get('mensal/:id')
  findMonthly(@Param('id') id: string) {
    return this.entradaService.findMonthly(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntradaDto: UpdateEntradaDto) {
    return this.entradaService.update(id, updateEntradaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entradaService.remove(id);
  }

  @Post('caixa')
  caixa(){
    return this.entradaService.caixa()
  }
}
