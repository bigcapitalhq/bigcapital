import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { castArray } from 'lodash';
import { Response } from 'express';
import { AcceptType } from '@/constants/accept-type';
import { TrialBalanceSheetApplication } from './TrialBalanceSheetApplication';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { TrialBalanceSheetQueryDto } from './TrialBalanceSheetQuery.dto';
import { TrialBalanceSheetResponseExample } from './TrialBalanceSheet.swagger';
import {
  TrialBalanceSheetResponseDto,
  TrialBalanceSheetTableResponseDto,
} from './TrialBalanceSheetResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('reports/trial-balance-sheet')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  TrialBalanceSheetResponseDto,
  TrialBalanceSheetTableResponseDto,
  NumberFormatQueryDto,
)
// Restrict this financial report to authenticated users granted the trial-balance read permission.
@UseGuards(AuthorizationGuard, PermissionGuard)
export class TrialBalanceSheetController {
  constructor(
    private readonly trialBalanceSheetApp: TrialBalanceSheetApplication,
  ) {}

  @Get()
  @RequirePermission(
    ReportsAction.READ_TRIAL_BALANCE_SHEET,
    AbilitySubject.Report,
  )
  @ApiOperation({ summary: 'Get trial balance sheet' })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  @ApiResponse({
    status: 200,
    description: 'Trial balance sheet',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(TrialBalanceSheetResponseDto) },
        example: TrialBalanceSheetResponseExample,
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(TrialBalanceSheetTableResponseDto) },
      },
    },
  })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  async getTrialBalanceSheet(
    @Query() query: TrialBalanceSheetQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    const filter = {
      ...query,
      accountIds: castArray(query.accountIds),
    };
    // Retrieves in json table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.trialBalanceSheetApp.table(filter);
      // Retrieves in xlsx format
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.trialBalanceSheetApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves in csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.trialBalanceSheetApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves in pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.trialBalanceSheetApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves in json format.
    } else {
      return this.trialBalanceSheetApp.sheet(filter);
    }
  }
}
