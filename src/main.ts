import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as fs from 'fs/promises';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Post Comment Demo')
    .setDescription('Post Comment API Description')
    .setBasePath('/api/')
    .setVersion('1.0')
    .setContact(
      'Prathamesh Patil',
      'https://bigscal.com',
      'prathmesh@bigscal.com',
    )
    .addTag('Auth', "Authentication API's")
    .addTag('Users', "User APi's")
    .addTag('Posts', "Posts APi's")
    .addTag('Comments', "Comments APi's")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customCssForSwagger = await fs.readFile(
    join(process.cwd(), 'public', 'css', 'theme-material.css'),
    'utf-8',
  );

  SwaggerModule.setup('api-docs', app, document, {
    customCss: customCssForSwagger,
  });

  await app.listen(3000);
}
bootstrap();
