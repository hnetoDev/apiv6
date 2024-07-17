import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { middleware } from './midlleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    allowedHeaders: ['Content-Type']
  })
  app.use(middleware)
  
  await app.listen(3000);
}
bootstrap();
