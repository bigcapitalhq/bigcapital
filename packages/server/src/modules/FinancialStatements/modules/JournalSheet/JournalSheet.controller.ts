import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AcceptType } from '@/constants/accept-type';
import { JournalSheetApplication } from './JournalSheetApplication';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JournalSheetQueryDto } from './JournalSheetQuery.dto';
import { JournalSheetResponseExample } from './JournalSheet.swagger';
import {
  JournalSheetResponseDto,
  JournalSheetTableResponseDto,
} from './JournalSheetResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('/reports/journal')
@ApiTags('Reports')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
@ApiExtraModels(JournalSheetResponseDto, JournalSheetTableResponseDto)
export class JournalSheetController {
  constructor(private readonly journalSheetApp: JournalSheetApplication) {}

  @Get()
  @RequirePermission(ReportsAction.READ_JOURNAL, AbilitySubject.Report)
  @ApiResponse({
    status: 200,
    description: 'Journal report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(JournalSheetResponseDto) },
        example: JournalSheetResponseExample,
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(JournalSheetTableResponseDto) },
      },
    },
  })
  @ApiOperation({ summary: 'Journal report' })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  async journalSheet(
    @Query() query: JournalSheetQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the json table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.journalSheetApp.table(query);

      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.journalSheetApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.journalSheetApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the json format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.journalSheetApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      return this.journalSheetApp.sheet(query);
    }
  }
}
