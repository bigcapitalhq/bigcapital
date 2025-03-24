import { Response } from 'express';
import { convertAcceptFormatToFormat } from './_utils';
import { Controller, Headers, Query, Res } from '@nestjs/common';
import { ExportQuery } from './dtos/ExportQuery.dto';
import { ExportResourceService } from './ExportService';
import { AcceptType } from '@/constants/accept-type';

@Controller('/export')
export class ExportController {
  constructor(private readonly exportResourceApp: ExportResourceService) {}

  async export(
    @Query() query: ExportQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const applicationFormat = convertAcceptFormatToFormat(acceptType);

    const data = await this.exportResourceApp.export(
      query.resource,
      applicationFormat,
    );
    // Retrieves the csv format.
    if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(data);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(data);
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
