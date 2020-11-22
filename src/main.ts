import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  // setting correct port heroku config
  const app = await NestFactory.create(AppModule);

  // swagger config
  const options = new DocumentBuilder()
    .setTitle('Swipebank documentation')
    .setDescription('URL BASE: https://dev-swipebank-api.herokuapp.com/')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // cors
  app.enableCors();

  // starting app
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
}
bootstrap();
