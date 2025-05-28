import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { LoggerMiddleware } from './interceptors/logger.middleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    dotenv.config();
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  app.use(new LoggerMiddleware().use); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
