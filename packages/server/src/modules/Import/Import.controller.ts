import { FileInterceptor } from '@nestjs/platform-express';
import { defaultTo } from 'lodash';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ImportResourceApplication } from './ImportResourceApplication';
import { uploadImportFileMulterOptions } from './ImportMulter.utils';
import { parseJsonSafe } from '@/utils/parse-json';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { ImportFileUploadResponseDto } from './ImportFileUploadResponse.dto';

@Controller('import')
@ApiTags('Import')
@ApiCommonHeaders()
export class ImportController {
  constructor(private readonly importResourceApp: ImportResourceApplication) {}

  /**
   * Imports xlsx/csv to the given resource type.
   */
  @Post('/file')
  @HttpCode(200)
  @ApiOperation({ summary: 'Upload import file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        resource: { type: 'string' },
        params: { type: 'string', description: 'Optional JSON-encoded params' },
      },
      required: ['file', 'resource'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File uploaded successfully',
    type: ImportFileUploadResponseDto,
  })
  @UseInterceptors(FileInterceptor('file', uploadImportFileMulterOptions))
  async fileUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('resource') resource: string,
    @Body('params') rawParams?: string,
  ) {
    const params = defaultTo(parseJsonSafe(rawParams), {});

    return this.importResourceApp.import(resource, file.filename, params);
  }

  /**
   * Maps the columns of the imported file.
   */
  @Post('/:import_id/mapping')
  @HttpCode(200)
  @ApiOperation({ summary: 'Map import columns' })
  @ApiResponse({ status: 200, description: 'Mapping successful' })
  async mapping(
    @Param('import_id') importId: string,
    @Body('mapping')
    mapping: Array<{ group?: string; from: string; to: string }>,
  ) {
    return this.importResourceApp.mapping(importId, mapping);
  }

  /**
   * Preview the imported file before actual importing.
   */
  @Get('/:import_id/preview')
  @HttpCode(200)
  @ApiOperation({ summary: 'Preview import data' })
  @ApiResponse({ status: 200, description: 'Preview data' })
  async preview(@Param('import_id') importId: string) {
    return this.importResourceApp.preview(importId);
  }

  /**
   * Importing the imported file to the application storage.
   */
  @Post('/:import_id/import')
  @ApiOperation({ summary: 'Process import' })
  @ApiResponse({ status: 200, description: 'Import processed successfully' })
  async import(@Param('import_id') importId: string) {
    return this.importResourceApp.process(importId);
  }

  /**
   * Retrieves the csv/xlsx sample sheet of the given resource name.
   */
  @Get('/sample')
  @ApiOperation({ summary: 'Get import sample' })
  @ApiResponse({
    status: 200,
    description: 'Sample sheet file (csv or xlsx)',
    content: {
      'application/octet-stream': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async downloadImportSample(
    @Query('resource') resource: string,
    @Query('format') format?: 'csv' | 'xlsx',
  ) {
    return this.importResourceApp.sample(resource, format);
  }

  /**
   * Retrieves the import file meta.
   */
  @Get('/:import_id')
  @ApiOperation({ summary: 'Get import metadata' })
  @ApiResponse({ status: 200, description: 'Import metadata' })
  async getImportFileMeta(@Param('import_id') importId: string) {
    return this.importResourceApp.importMeta(importId);
  }
}
