import { Response } from 'express';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CustomerBalanceSummaryApplication } from './CustomerBalanceSummaryApplication';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { CustomerBalanceSummaryQueryDto } from './CustomerBalanceSummaryQuery.dto';
import { AcceptType } from '@/constants/accept-type';
import {
  CustomerBalanceSummaryResponseDto,
  CustomerBalanceSummaryTableResponseDto,
} from './CustomerBalanceSummaryResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('/reports/customer-balance-summary')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  CustomerBalanceSummaryResponseDto,
  CustomerBalanceSummaryTableResponseDto,
  NumberFormatQueryDto,
)
// Restrict this financial report to authenticated users granted the customer-balance read permission.
@UseGuards(AuthorizationGuard, PermissionGuard)
export class CustomerBalanceSummaryController {
  constructor(
    private readonly customerBalanceSummaryApp: CustomerBalanceSummaryApplication,
  ) {}

  @Get()
  @RequirePermission(
    ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
    AbilitySubject.Report,
  )
  @ApiResponse({
    status: 200,
    description: 'Customer balance summary report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(CustomerBalanceSummaryResponseDto) },
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(CustomerBalanceSummaryTableResponseDto) },
      },
    },
  })
  @ApiOperation({ summary: 'Get customer balance summary report' })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  async customerBalanceSummary(
    @Query() filter: CustomerBalanceSummaryQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the xlsx format.
    if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.customerBalanceSummaryApp.xlsx(filter);
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.customerBalanceSummaryApp.csv(filter);
      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.customerBalanceSummaryApp.table(filter);

      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const buffer = await this.customerBalanceSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
      res.send(buffer);
      // Retrieves the json format.
    } else {
      return this.customerBalanceSummaryApp.sheet(filter);
    }
  }
}
