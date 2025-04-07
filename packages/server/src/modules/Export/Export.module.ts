import { Module } from '@nestjs/common';
import { ExportController } from './Export.controller';
import { ExportResourceService } from './ExportService';
import { ExportPdf } from './ExportPdf';
import { ExportAls } from './ExportAls';
import { ExportApplication } from './ExportApplication';

@Module({
  providers: [ExportResourceService, ExportPdf, ExportAls, ExportApplication],
  controllers: [ExportController],
})
export class ExportModule {}
