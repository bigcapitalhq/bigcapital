import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialTableColumnDto,
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';
import {
  PURCHASES_BY_ITEMS_COLUMN_KEYS,
  PurchasesByItemsColumnKey,
} from '../../common/constants/tableColumnKeys';

export class PurchasesByItemDto {
  @ApiProperty({ description: 'Item ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Item name' })
  name: string;

  @ApiProperty({ description: 'Item code' })
  code: string;

  @ApiProperty({ description: 'Item type' })
  type: string;

  @ApiProperty({ description: 'Quantity purchased', type: Number })
  quantity: number;

  @ApiProperty({
    description: 'Total purchases amount',
    type: FinancialReportTotalDto,
  })
  total: FinancialReportTotalDto;

  @ApiPropertyOptional({ description: 'Average cost', type: Number })
  averageCost?: number;
}

export class PurchasesByItemsMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class PurchasesByItemsQueryResponseDto {
  @ApiProperty({ description: 'Start date' })
  fromDate: string;

  @ApiProperty({ description: 'End date' })
  toDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Item IDs to include', type: [Number] })
  itemsIds: number[];

  @ApiProperty({ description: 'Vendor IDs to include', type: [Number] })
  vendorsIds: number[];
}

export class PurchasesByItemsResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: PurchasesByItemsQueryResponseDto,
  })
  query: PurchasesByItemsQueryResponseDto;

  @ApiProperty({
    description: 'Purchases by items',
    type: [PurchasesByItemDto],
  })
  data: PurchasesByItemDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: PurchasesByItemsMetaDto,
  })
  meta: PurchasesByItemsMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as PurchasesByItemsTableCellDto,
  FinancialTableRowDto as PurchasesByItemsTableRowDto,
} from '../../dtos/FinancialReportResponse.dto';

export class PurchasesByItemsTableColumnDto extends FinancialTableColumnDto {
  @ApiProperty({
    description: 'Column key',
    enum: Object.values(PURCHASES_BY_ITEMS_COLUMN_KEYS),
  })
  key: PurchasesByItemsColumnKey;
}

export class PurchasesByItemsTableDataDto extends FinancialTableDataDto {
  @ApiProperty({
    description: 'Table column definitions',
    type: [PurchasesByItemsTableColumnDto],
  })
  columns: PurchasesByItemsTableColumnDto[];
}

export class PurchasesByItemsTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => PurchasesByItemsTableDataDto,
  })
  table: PurchasesByItemsTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: PurchasesByItemsQueryResponseDto,
  })
  query: PurchasesByItemsQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: PurchasesByItemsMetaDto,
  })
  meta: PurchasesByItemsMetaDto;
}
