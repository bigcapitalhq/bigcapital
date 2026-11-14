import { Command, CommandRunner } from 'nest-commander';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClsMiddleware } from 'nestjs-cls';
import * as path from 'path';
import * as fs from 'fs';
import '@/utils/moment-mysql';
import { AppModule } from '@/modules/App/App.module';
import { NestExpressApplication } from '@nestjs/platform-express';

@Command({
  name: 'openapi:export',
  description:
    'Export the OpenAPI document from the NestJS app to shared/sdk-ts/openapi.json',
})
export class OpenApiExportCommand extends CommandRunner {
  async run(): Promise<void> {
    const serverRoot = process.cwd();
    global.__public_dirname = path.join(serverRoot, 'public');
    global.__static_dirname = path.join(serverRoot, 'static');
    global.__views_dirname = path.join(global.__static_dirname, '/views');
    global.__images_dirname = path.join(global.__static_dirname, '/images');

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      rawBody: true,
    });
    app.set('query parser', 'extended');
    app.setGlobalPrefix('/api');
    app.use(new ClsMiddleware({}).use);

    const config = new DocumentBuilder()
      .setTitle('Bigcapital')
      .setDescription('Financial accounting software')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const outputPath = path.resolve(
      process.cwd(),
      '../../shared/sdk-ts/openapi.json',
    );
    try {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf-8');
      console.log(`OpenAPI spec written to ${outputPath}`);
    } catch (error) {
      console.error('Failed to write the OpenAPI spec', error);
      process.exit(1);
    }
    // The Nest app keeps background Redis/BullMQ connections open. The
    // document is already written, so exit explicitly instead of waiting for
    // a graceful shutdown that can reject while closing those connections.
    process.exit(0);
  }
}
