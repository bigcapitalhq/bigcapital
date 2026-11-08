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
import { AcceptType } from '@/constants/accept-type';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';
import { InventorySummaryApplication } from './InventorySummaryApplication';
import { InventorySummaryQueryDto } from './InventorySummaryQuery.dto';
import {
  InventorySummaryResponseDto,
  InventorySummaryTableResponseDto,
} from './InventorySummaryResponse.dto';

@Controller('reports/inventory-summary')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  InventorySummaryResponseDto,
  InventorySummaryTableResponseDto,
  NumberFormatQueryDto,
)
@UseGuards(AuthorizationGuard, PermissionGuard)
export class InventorySummaryController {
  constructor(
    private readonly inventorySummaryApp: InventorySummaryApplication,
  ) {}

  @Get()
  @RequirePermission(
    ReportsAction.READ_INVENTORY_SUMMARY,
    AbilitySubject.Report,
  )
  @ApiOperation({ summary: 'Retrieves the inventory summary report' })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  @ApiResponse({
    status: 200,
    description: 'The inventory summary report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(InventorySummaryResponseDto) },
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(InventorySummaryTableResponseDto) },
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
  public async getInventorySummary(
    @Query() query: InventorySummaryQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';

    if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.inventorySummaryApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.inventorySummaryApp.table(query);
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.inventorySummaryApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const buffer = await this.inventorySummaryApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
      res.send(buffer);
    } else {
      return this.inventorySummaryApp.sheet(query);
    }
  }
}
