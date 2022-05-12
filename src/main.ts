import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(requestIp.mw());
  await app.listen(process.env.PORT);
  Logger.warn('server start on port ', process.env.PORT);
}
bootstrap();
