import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getFileEx(id: string,res: Response){
    return res.sendFile(path.join(__dirname, "../public/exercicios/" + id ))
  }

  getFileU(id: string,res: Response){
    return res.sendFile(path.join(__dirname, "../public/users/" + id ))
  }
}
