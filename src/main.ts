import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ONYX API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT ?? 5000;

  const corsOptions = {
    credentials: true,
    origin: '*',
  };

  app.useGlobalPipes(new ValidationPipe());
  app.use(cors(corsOptions));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useLogger(app.get(Logger));

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
