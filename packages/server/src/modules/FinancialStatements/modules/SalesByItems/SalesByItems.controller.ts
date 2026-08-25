import {
  Body,
  Controller,
  Get,
  Headers,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AcceptType } from '@/constants/accept-type';
import { SalesByItemsApplication } from './SalesByItemsApplication';
import { Response } from 'express';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { SalesByItemsQueryDto } from './SalesByItemsQuery.dto';
import {
  SalesByItemsResponseDto,
  SalesByItemsTableResponseDto,
} from './SalesByItemsResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('/reports/sales-by-items')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  SalesByItemsResponseDto,
  SalesByItemsTableResponseDto,
  NumberFormatQueryDto,
)
// Restrict this financial report to authenticated users granted the sales-by-items read permission.
@UseGuards(AuthorizationGuard, PermissionGuard)
export class SalesByItemsController {
  constructor(private readonly salesByItemsApp: SalesByItemsApplication) {}

  @Get()
  @RequirePermission(ReportsAction.READ_SALES_BY_ITEMS, AbilitySubject.Report)
  @ApiResponse({
    status: 200,
    description: 'Sales by items report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(SalesByItemsResponseDto) },
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(SalesByItemsTableResponseDto) },
      },
    },
  })
  @ApiOperation({
    summary: 'Sales by items report',
    description: 'Retrieves the sales by items report.',
  })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  public async salesByitems(
    @Query() filter: SalesByItemsQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the csv format.
    if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.salesByItemsApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the json table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.salesByItemsApp.table(filter);
      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = this.salesByItemsApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the json format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.salesByItemsApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      return this.salesByItemsApp.sheet(filter);
    }
  }
}
