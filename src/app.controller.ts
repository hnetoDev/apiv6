import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('public/exercicios/:id')
  getFileEx(@Param('id') id: string,@Res() res: Response){
    return this.appService.getFileEx(id,res);
  }

  @Get('public/users/:id')
  getFileU(@Param('id') id: string,@Res() res: Response){
    return this.appService.getFileU(id,res);
  }
}
