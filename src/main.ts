import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const types = require('pg').types;
import { pg } from 'pg';
async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Swipebank documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  pg.types.setTypeParser(types.builtins.NUMERIC, val => Number(val));

  await app.listen(port);
}
bootstrap();
