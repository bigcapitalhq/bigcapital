import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { AcceptType } from '@/constants/accept-type';
import { ExportQuery } from './dtos/ExportQuery.dto';
import { ExportResourceService } from './ExportService';
import { convertAcceptFormatToFormat } from './Export.utils';

@Controller('/export')
@ApiTags('export')
export class ExportController {
  constructor(private readonly exportResourceApp: ExportResourceService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieves exported the given resource.' })
  async export(
    @Query() query: ExportQuery,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const applicationFormat = convertAcceptFormatToFormat(acceptHeader);

    const data = await this.exportResourceApp.export(
      query.resource,
      applicationFormat,
    );
    // Retrieves the csv format.
    if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(data);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(data);
      // Retrieve the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': data.length,
      });
      res.send(data);
    }
  }
}
