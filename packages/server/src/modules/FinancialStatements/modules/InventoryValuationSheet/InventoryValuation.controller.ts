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
import { InventoryValuationSheetApplication } from './InventoryValuationSheetApplication';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { InventoryValuationQueryDto } from './InventoryValuationQuery.dto';
import { AcceptType } from '@/constants/accept-type';
import {
  InventoryValuationResponseDto,
  InventoryValuationTableResponseDto,
} from './InventoryValuationResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('reports/inventory-valuation')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  InventoryValuationResponseDto,
  InventoryValuationTableResponseDto,
  NumberFormatQueryDto,
)
// Restrict this financial report to authenticated users granted the inventory-valuation read permission.
@UseGuards(AuthorizationGuard, PermissionGuard)
export class InventoryValuationController {
  constructor(
    private readonly inventoryValuationApp: InventoryValuationSheetApplication,
  ) {}

  @Get()
  @RequirePermission(
    ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
    AbilitySubject.Report,
  )
  @ApiOperation({ summary: 'Retrieves the inventory valuation sheet' })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  @ApiResponse({
    status: 200,
    description: 'The inventory valuation sheet',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(InventoryValuationResponseDto) },
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(InventoryValuationTableResponseDto) },
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
  public async getInventoryValuationSheet(
    @Query() query: InventoryValuationQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the json table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.inventoryValuationApp.table(query);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.inventoryValuationApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the xslx buffer format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.inventoryValuationApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.inventoryValuationApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.status(200).send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.inventoryValuationApp.sheet(query);
    }
  }
}
