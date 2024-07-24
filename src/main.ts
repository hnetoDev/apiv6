import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
import { middleware } from './midlleware';



async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser:true
  });
  
  app.enableCors({
    allowedHeaders: ['Content-Type']
  })
  app.use(middleware)
  app.use(bodyParser.urlencoded({extended:true}))
  app.use(bodyParser.json())
  await app.listen(3000);
}
bootstrap();
