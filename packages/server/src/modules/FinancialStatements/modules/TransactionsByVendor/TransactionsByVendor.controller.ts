import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ITransactionsByVendorsFilter } from './TransactionsByVendor.types';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';
import { TransactionsByVendorApplication } from './TransactionsByVendorApplication';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  TransactionsByVendorResponseDto,
  TransactionsByVendorTableResponseDto,
} from './TransactionsByVendorResponse.dto';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { TransactionsByVendorQueryDto } from './TransactionsByVendorQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('/reports/transactions-by-vendors')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  TransactionsByVendorResponseDto,
  TransactionsByVendorTableResponseDto,
  NumberFormatQueryDto,
)
// Restrict this financial report to authenticated users granted the vendors-transactions read permission.
@UseGuards(AuthorizationGuard, PermissionGuard)
export class TransactionsByVendorController {
  constructor(
    private readonly transactionsByVendorsApp: TransactionsByVendorApplication,
  ) {}

  @Get()
  @RequirePermission(
    ReportsAction.READ_VENDORS_TRANSACTIONS,
    AbilitySubject.Report,
  )
  @ApiOperation({ summary: 'Get transactions by vendor' })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions by vendor',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(TransactionsByVendorResponseDto) },
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(TransactionsByVendorTableResponseDto) },
      },
    },
  })
  async transactionsByVendor(
    @Query() filter: TransactionsByVendorQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the xlsx format.
    if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.transactionsByVendorsApp.xlsx(filter);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

      res.send(buffer);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.transactionsByVendorsApp.csv(filter);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=report.csv');

      res.send(buffer);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.transactionsByVendorsApp.table(filter);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.transactionsByVendorsApp.pdf(filter);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.transactionsByVendorsApp.sheet(filter);
    }
  }
}
