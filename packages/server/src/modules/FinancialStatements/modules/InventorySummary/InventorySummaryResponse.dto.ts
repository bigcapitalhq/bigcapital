import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialTableColumnDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';
import {
  INVENTORY_SUMMARY_COLUMN_KEYS,
  InventorySummaryColumnKey,
} from '../../common/constants/tableColumnKeys';

export class InventorySummaryItemDto {
  @ApiProperty({ description: 'Item ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Item name' })
  name: string;

  @ApiProperty({ description: 'Item code' })
  code: string;

  @ApiProperty({ description: 'Opening stock quantity', type: Number })
  openingStock: number;

  @ApiProperty({ description: 'Quantity received in the period', type: Number })
  quantityIn: number;

  @ApiProperty({
    description: 'Quantity issued out in the period',
    type: Number,
  })
  quantityOut: number;

  @ApiProperty({ description: 'Closing stock quantity', type: Number })
  closingStock: number;

  @ApiProperty({ description: 'Formatted opening stock quantity' })
  openingStockFormatted: string;

  @ApiProperty({ description: 'Formatted quantity in' })
  quantityInFormatted: string;

  @ApiProperty({ description: 'Formatted quantity out' })
  quantityOutFormatted: string;

  @ApiProperty({ description: 'Formatted closing stock quantity' })
  closingStockFormatted: string;
}

export class InventorySummaryTotalDto {
  @ApiProperty({ description: 'Total opening stock quantity', type: Number })
  openingStock: number;

  @ApiProperty({ description: 'Total quantity in', type: Number })
  quantityIn: number;

  @ApiProperty({ description: 'Total quantity out', type: Number })
  quantityOut: number;

  @ApiProperty({ description: 'Total closing stock quantity', type: Number })
  closingStock: number;

  @ApiProperty({ description: 'Formatted total opening stock quantity' })
  openingStockFormatted: string;

  @ApiProperty({ description: 'Formatted total quantity in' })
  quantityInFormatted: string;

  @ApiProperty({ description: 'Formatted total quantity out' })
  quantityOutFormatted: string;

  @ApiProperty({ description: 'Formatted total closing stock quantity' })
  closingStockFormatted: string;
}

export class InventorySummaryDataDto {
  @ApiProperty({
    description: 'Inventory summary items',
    type: [InventorySummaryItemDto],
  })
  items: InventorySummaryItemDto[];

  @ApiProperty({
    description: 'Inventory summary totals',
    type: InventorySummaryTotalDto,
  })
  total: InventorySummaryTotalDto;
}

export class InventorySummaryMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class InventorySummaryQueryResponseDto {
  @ApiProperty({ description: 'From date' })
  fromDate: string;

  @ApiProperty({ description: 'To date' })
  toDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Exclude items without transactions' })
  noneTransactions: boolean;

  @ApiProperty({ description: 'Item IDs to include', type: [Number] })
  itemsIds: number[];

  @ApiPropertyOptional({
    description: 'Warehouse IDs to include',
    type: [Number],
  })
  warehousesIds?: number[];

  @ApiPropertyOptional({ description: 'Branch IDs to include', type: [Number] })
  branchesIds?: number[];
}

export class InventorySummaryResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: InventorySummaryQueryResponseDto,
  })
  query: InventorySummaryQueryResponseDto;

  @ApiProperty({
    description: 'Inventory summary data',
    type: InventorySummaryDataDto,
  })
  data: InventorySummaryDataDto;

  @ApiProperty({
    description: 'Report metadata',
    type: InventorySummaryMetaDto,
  })
  meta: InventorySummaryMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as InventorySummaryTableCellDto,
  FinancialTableRowDto as InventorySummaryTableRowDto,
} from '../../dtos/FinancialReportResponse.dto';

export class InventorySummaryTableColumnDto extends FinancialTableColumnDto {
  @ApiProperty({
    description: 'Column key',
    enum: Object.values(INVENTORY_SUMMARY_COLUMN_KEYS),
  })
  key: InventorySummaryColumnKey;
}

export class InventorySummaryTableDataDto extends FinancialTableDataDto {
  @ApiProperty({
    description: 'Table column definitions',
    type: [InventorySummaryTableColumnDto],
  })
  columns: InventorySummaryTableColumnDto[];
}

export class InventorySummaryTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => InventorySummaryTableDataDto,
  })
  table: InventorySummaryTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: InventorySummaryQueryResponseDto,
  })
  query: InventorySummaryQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: InventorySummaryMetaDto,
  })
  meta: InventorySummaryMetaDto;
}
