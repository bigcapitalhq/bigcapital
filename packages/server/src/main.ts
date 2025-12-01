import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClsMiddleware } from 'nestjs-cls';
import * as path from 'path';
import './utils/moment-mysql';
import { AppModule } from './modules/App/App.module';
import { ServiceErrorFilter } from './common/filters/service-error.filter';
import { ModelHasRelationsFilter } from './common/filters/model-has-relations.filter';
import { ValidationPipe } from './common/pipes/ClassValidation.pipe';
import { ToJsonInterceptor } from './common/interceptors/to-json.interceptor';

global.__public_dirname = path.join(__dirname, '..', 'public');
global.__static_dirname = path.join(__dirname, '../static');
global.__views_dirname = path.join(global.__static_dirname, '/views');
global.__images_dirname = path.join(global.__static_dirname, '/images');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.setGlobalPrefix('/api');

  // create and mount the middleware manually here
  app.use(new ClsMiddleware({}).use);

  app.useGlobalInterceptors(new ToJsonInterceptor());

  // use the validation pipe globally
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Bigcapital')
    .setDescription('Financial accounting software')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.useGlobalFilters(new ServiceErrorFilter());
  app.useGlobalFilters(new ModelHasRelationsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
