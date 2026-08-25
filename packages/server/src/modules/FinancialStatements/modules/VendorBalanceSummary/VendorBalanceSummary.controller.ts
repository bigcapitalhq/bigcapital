import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IVendorBalanceSummaryQuery } from './VendorBalanceSummary.types';
import { VendorBalanceSummaryApplication } from './VendorBalanceSummaryApplication';
import { Response } from 'express';
import { AcceptType } from '@/constants/accept-type';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { VendorBalanceSummaryQueryDto } from './VendorBalanceSummaryQuery.dto';
import {
  VendorBalanceSummaryResponseDto,
  VendorBalanceSummaryTableResponseDto,
} from './VendorBalanceSummaryResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('/reports/vendor-balance-summary')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  VendorBalanceSummaryResponseDto,
  VendorBalanceSummaryTableResponseDto,
  NumberFormatQueryDto,
)
// Restrict this financial report to authenticated users granted the vendor-balance read permission.
@UseGuards(AuthorizationGuard, PermissionGuard)
export class VendorBalanceSummaryController {
  constructor(
    private readonly vendorBalanceSummaryApp: VendorBalanceSummaryApplication,
  ) {}

  @Get()
  @RequirePermission(
    ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
    AbilitySubject.Report,
  )
  @ApiOperation({ summary: 'Get vendor balance summary' })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor balance summary',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(VendorBalanceSummaryResponseDto) },
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(VendorBalanceSummaryTableResponseDto) },
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
  async vendorBalanceSummary(
    @Query() filter: VendorBalanceSummaryQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the csv format.
    if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.vendorBalanceSummaryApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.vendorBalanceSummaryApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');

      res.send(buffer);

      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.vendorBalanceSummaryApp.table(filter);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.vendorBalanceSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.vendorBalanceSummaryApp.sheet(filter);
    }
  }
}
