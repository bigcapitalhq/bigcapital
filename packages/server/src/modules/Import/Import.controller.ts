import { Response, NextFunction } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { defaultTo } from 'lodash';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Res,
  Next,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImportResourceApplication } from './ImportResourceApplication';
import { uploadImportFileMulterOptions } from './ImportMulter.utils';
import { parseJsonSafe } from '@/utils/parse-json';

@Controller('import')
@ApiTags('import')
export class ImportController {
  constructor(private readonly importResourceApp: ImportResourceApplication) {}

  /**
   * Imports xlsx/csv to the given resource type.
   */
  @Post('/file')
  @ApiOperation({ summary: 'Upload import file' })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  @UseInterceptors(
    FileInterceptor('file', { storage: uploadImportFileMulterOptions }),
  )
  async fileUpload(
    @Res() res: Response,
    @Next() next: NextFunction,
    @UploadedFile() file: Express.Multer.File,
    @Body('resource') resource: string,
    @Body('params') rawParams?: string,
  ) {
    const params = defaultTo(parseJsonSafe(rawParams), {});

    try {
      const data = await this.importResourceApp.import(
        resource,
        file.filename,
        params,
      );
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Maps the columns of the imported file.
   */
  @Post('/:import_id/mapping')
  @ApiOperation({ summary: 'Map import columns' })
  @ApiResponse({ status: 200, description: 'Mapping successful' })
  async mapping(
    @Res() res: Response,
    @Param('import_id') importId: string,
    @Body('mapping')
    mapping: Array<{ group?: string; from: string; to: string }>,
  ) {
    const result = await this.importResourceApp.mapping(importId, mapping);

    return res.status(200).send(result);
  }

  /**
   * Preview the imported file before actual importing.
   */
  @Get('/:import_id/preview')
  @ApiOperation({ summary: 'Preview import data' })
  @ApiResponse({ status: 200, description: 'Preview data' })
  async preview(@Res() res: Response, @Param('import_id') importId: string) {
    const preview = await this.importResourceApp.preview(importId);

    return res.status(200).send(preview);
  }

  /**
   * Importing the imported file to the application storage.
   */
  @Post('/:import_id/import')
  @ApiOperation({ summary: 'Process import' })
  @ApiResponse({ status: 200, description: 'Import processed successfully' })
  async import(@Res() res: Response, @Param('import_id') importId: string) {
    const result = await this.importResourceApp.process(importId);

    return res.status(200).send(result);
  }

  /**
   * Retrieves the csv/xlsx sample sheet of the given resource name.
   */
  @Get('/sample')
  @ApiOperation({ summary: 'Get import sample' })
  @ApiResponse({ status: 200, description: 'Sample data' })
  async downloadImportSample(
    @Res() res: Response,
    @Query('resource') resource: string,
    @Query('format') format?: 'csv' | 'xlsx',
  ) {
    const result = await this.importResourceApp.sample(resource, format);

    return res.status(200).send(result);
  }

  /**
   * Retrieves the import file meta.
   */
  @Get('/:import_id')
  @ApiOperation({ summary: 'Get import metadata' })
  @ApiResponse({ status: 200, description: 'Import metadata' })
  async getImportFileMeta(
    @Res() res: Response,
    @Param('import_id') importId: string,
  ) {
    const result = await this.importResourceApp.importMeta(importId);
    return res.status(200).send(result);
  }
}
