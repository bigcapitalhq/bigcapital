import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportMetaDto,
  FinancialTableColumnDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';
import {
  INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS,
  InventoryTurnoverByAmountColumnKey,
} from '../../common/constants/tableColumnKeys';

export class InventoryTurnoverByAmountItemDto {
  @ApiProperty({ description: 'Item ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Item name' })
  name: string;

  @ApiProperty({ description: 'Item code' })
  code: string;

  @ApiProperty({ description: 'Opening inventory balance', type: Number })
  openingBalance: number;

  @ApiProperty({ description: 'Closing inventory balance', type: Number })
  closingBalance: number;

  @ApiProperty({ description: 'Cost of goods sold', type: Number })
  costOfGoodsSold: number;

  @ApiProperty({ description: 'Average inventory price', type: Number })
  averagePrice: number;

  @ApiProperty({ description: 'Inventory turnover ratio', type: Number })
  turnoverRatio: number;

  @ApiProperty({ description: 'Average turnover days', type: Number })
  averageTurnoverDays: number;

  @ApiProperty({ description: 'Quantity on hand', type: Number })
  qtyOnHand: number;

  @ApiPropertyOptional({
    description: 'Last sale date',
    type: String,
    nullable: true,
  })
  lastSellDate?: string | Date | null;

  @ApiProperty({ description: 'Formatted opening balance' })
  openingBalanceFormatted: string;

  @ApiProperty({ description: 'Formatted closing balance' })
  closingBalanceFormatted: string;

  @ApiProperty({ description: 'Formatted cost of goods sold' })
  costOfGoodsSoldFormatted: string;

  @ApiProperty({ description: 'Formatted average price' })
  averagePriceFormatted: string;

  @ApiProperty({ description: 'Formatted turnover ratio' })
  turnoverRatioFormatted: string;

  @ApiProperty({ description: 'Formatted average turnover days' })
  averageTurnoverDaysFormatted: string;

  @ApiProperty({ description: 'Formatted quantity on hand' })
  qtyOnHandFormatted: string;

  @ApiProperty({ description: 'Formatted last sale date' })
  lastSellDateFormatted: string;

  @ApiProperty({ description: 'Currency code' })
  currencyCode: string;
}

export class InventoryTurnoverByAmountTotalDto {
  @ApiProperty({ description: 'Total opening balance', type: Number })
  openingBalance: number;

  @ApiProperty({ description: 'Total closing balance', type: Number })
  closingBalance: number;

  @ApiProperty({ description: 'Total cost of goods sold', type: Number })
  costOfGoodsSold: number;

  @ApiProperty({ description: 'Total average price', type: Number })
  averagePrice: number;

  @ApiProperty({ description: 'Total turnover ratio', type: Number })
  turnoverRatio: number;

  @ApiProperty({ description: 'Total average turnover days', type: Number })
  averageTurnoverDays: number;

  @ApiProperty({ description: 'Total quantity on hand', type: Number })
  qtyOnHand: number;

  @ApiPropertyOptional({
    description: 'Total last sale date',
    type: String,
    nullable: true,
  })
  lastSellDate?: string | null;

  @ApiProperty({ description: 'Formatted total opening balance' })
  openingBalanceFormatted: string;

  @ApiProperty({ description: 'Formatted total closing balance' })
  closingBalanceFormatted: string;

  @ApiProperty({ description: 'Formatted total cost of goods sold' })
  costOfGoodsSoldFormatted: string;

  @ApiProperty({ description: 'Formatted total average price' })
  averagePriceFormatted: string;

  @ApiProperty({ description: 'Formatted total turnover ratio' })
  turnoverRatioFormatted: string;

  @ApiProperty({ description: 'Formatted total average turnover days' })
  averageTurnoverDaysFormatted: string;

  @ApiProperty({ description: 'Formatted total quantity on hand' })
  qtyOnHandFormatted: string;

  @ApiProperty({ description: 'Formatted total last sale date' })
  lastSellDateFormatted: string;

  @ApiProperty({ description: 'Currency code' })
  currencyCode: string;
}

export class InventoryTurnoverByAmountDataDto {
  @ApiProperty({
    description: 'Inventory turnover items',
    type: [InventoryTurnoverByAmountItemDto],
  })
  items: InventoryTurnoverByAmountItemDto[];

  @ApiProperty({
    description: 'Inventory turnover totals',
    type: InventoryTurnoverByAmountTotalDto,
  })
  total: InventoryTurnoverByAmountTotalDto;
}

export class InventoryTurnoverByAmountMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class InventoryTurnoverByAmountQueryResponseDto {
  @ApiProperty({ description: 'From date' })
  fromDate: string;

  @ApiProperty({ description: 'To date' })
  toDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Item IDs to include', type: [Number] })
  itemsIds: number[];

  @ApiProperty({ description: 'Warehouse IDs to include', type: [Number] })
  warehousesIds: number[];

  @ApiProperty({ description: 'Branch IDs to include', type: [Number] })
  branchesIds: number[];
}

export class InventoryTurnoverByAmountResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: InventoryTurnoverByAmountQueryResponseDto,
  })
  query: InventoryTurnoverByAmountQueryResponseDto;

  @ApiProperty({
    description: 'Inventory turnover report data',
    type: InventoryTurnoverByAmountDataDto,
  })
  data: InventoryTurnoverByAmountDataDto;

  @ApiProperty({
    description: 'Report metadata',
    type: InventoryTurnoverByAmountMetaDto,
  })
  meta: InventoryTurnoverByAmountMetaDto;
}

export {
  FinancialTableCellDto as InventoryTurnoverByAmountTableCellDto,
  FinancialTableRowDto as InventoryTurnoverByAmountTableRowDto,
} from '../../dtos/FinancialReportResponse.dto';

export class InventoryTurnoverByAmountTableColumnDto extends FinancialTableColumnDto {
  @ApiProperty({
    description: 'Column key',
    enum: Object.values(INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS),
  })
  key: InventoryTurnoverByAmountColumnKey;
}

export class InventoryTurnoverByAmountTableDataDto extends FinancialTableDataDto {
  @ApiProperty({
    description: 'Table column definitions',
    type: [InventoryTurnoverByAmountTableColumnDto],
  })
  columns: InventoryTurnoverByAmountTableColumnDto[];
}

export class InventoryTurnoverByAmountTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => InventoryTurnoverByAmountTableDataDto,
  })
  table: InventoryTurnoverByAmountTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: InventoryTurnoverByAmountQueryResponseDto,
  })
  query: InventoryTurnoverByAmountQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: InventoryTurnoverByAmountMetaDto,
  })
  meta: InventoryTurnoverByAmountMetaDto;
}
