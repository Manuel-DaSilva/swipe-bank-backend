import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // setting correct port heroku config
  const logger = new Logger('Main');
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  // swagger config
  const options = new DocumentBuilder()
    .setTitle('Swipebank documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // cors
  app.enableCors();

  // starting app
  logger.log(`accpeting requests from all origins`);
  await app.listen(port);
  logger.log(
    `Aplication listening on port ${port}, started ${new Date(Date.now())}`,
  );
}
bootstrap();
