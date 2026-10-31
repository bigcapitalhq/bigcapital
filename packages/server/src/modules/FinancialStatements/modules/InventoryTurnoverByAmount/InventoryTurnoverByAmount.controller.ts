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
import { InventoryTurnoverByAmountApplication } from './InventoryTurnoverByAmountApplication';
import { InventoryTurnoverByAmountQueryDto } from './InventoryTurnoverByAmountQuery.dto';
import {
  InventoryTurnoverByAmountResponseDto,
  InventoryTurnoverByAmountTableResponseDto,
} from './InventoryTurnoverByAmountResponse.dto';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { AcceptType } from '@/constants/accept-type';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('reports/inventory-turnover-by-amount')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  InventoryTurnoverByAmountResponseDto,
  InventoryTurnoverByAmountTableResponseDto,
  NumberFormatQueryDto,
)
@UseGuards(AuthorizationGuard, PermissionGuard)
export class InventoryTurnoverByAmountController {
  constructor(
    private readonly inventoryTurnoverByAmountApp: InventoryTurnoverByAmountApplication,
  ) {}

  @Get('/')
  @RequirePermission(
    ReportsAction.READ_INVENTORY_TURNOVER_BY_AMOUNT,
    AbilitySubject.Report,
  )
  @ApiOperation({
    summary: 'Retrieves the inventory turnover by amount report',
  })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory turnover by amount report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(InventoryTurnoverByAmountResponseDto) },
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: {
          $ref: getSchemaPath(InventoryTurnoverByAmountTableResponseDto),
        },
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
  public async inventoryTurnoverByAmount(
    @Query() query: InventoryTurnoverByAmountQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.inventoryTurnoverByAmountApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.inventoryTurnoverByAmountApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.inventoryTurnoverByAmountApp.table(query);
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const buffer = await this.inventoryTurnoverByAmountApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
      res.send(buffer);
    } else {
      return this.inventoryTurnoverByAmountApp.sheet(query);
    }
  }
}
