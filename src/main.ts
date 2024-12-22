import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceErrorFilter } from './filters/service-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register the ServiceErrorFilter globally
  app.useGlobalFilters(new ServiceErrorFilter());

  await app.listen(3000);
}
bootstrap(); 