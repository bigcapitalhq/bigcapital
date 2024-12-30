import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClsMiddleware } from 'nestjs-cls';
import './utils/moment-mysql';
import { AppModule } from './modules/App/App.module';
import { ServiceErrorFilter } from './common/filters/service-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  // create and mount the middleware manually here
  app.use(new ClsMiddleware({}).use);

  const config = new DocumentBuilder()
    .setTitle('Bigcapital')
    .setDescription('Financial accounting software')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.useGlobalFilters(new ServiceErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
