import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class InventoryItemTransactionDto {
  @ApiProperty({ description: 'Transaction date' })
  date: string;

  @ApiProperty({ description: 'Formatted date' })
  dateFormatted: string;

  @ApiProperty({ description: 'Transaction type' })
  transactionType: string;

  @ApiProperty({ description: 'Reference ID', type: Number })
  referenceId: number;

  @ApiProperty({ description: 'Transaction number' })
  transactionNumber: string;

  @ApiPropertyOptional({ description: 'Transaction description' })
  description?: string;

  @ApiProperty({ description: 'Quantity', type: Number })
  quantity: number;

  @ApiProperty({ description: 'Rate', type: Number })
  rate: number;

  @ApiProperty({ description: 'Total amount', type: FinancialReportTotalDto })
  total: FinancialReportTotalDto;

  @ApiProperty({ description: 'Running quantity', type: Number })
  runningQuantity: number;
}

export class InventoryItemDetailDto {
  @ApiProperty({ description: 'Item ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Item name' })
  name: string;

  @ApiProperty({ description: 'Item code' })
  code: string;

  @ApiProperty({ description: 'Opening quantity', type: Number })
  openingQuantity: number;

  @ApiProperty({ description: 'Closing quantity', type: Number })
  closingQuantity: number;

  @ApiProperty({
    description: 'Item transactions',
    type: [InventoryItemTransactionDto],
  })
  transactions: InventoryItemTransactionDto[];
}

export class InventoryItemDetailsMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class InventoryItemDetailsQueryResponseDto {
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
}

export class InventoryItemDetailsResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: InventoryItemDetailsQueryResponseDto,
  })
  query: InventoryItemDetailsQueryResponseDto;

  @ApiProperty({
    description: 'Inventory items with details',
    type: [InventoryItemDetailDto],
  })
  data: InventoryItemDetailDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: InventoryItemDetailsMetaDto,
  })
  meta: InventoryItemDetailsMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as InventoryItemDetailsTableCellDto,
  FinancialTableRowDto as InventoryItemDetailsTableRowDto,
  FinancialTableColumnDto as InventoryItemDetailsTableColumnDto,
  FinancialTableDataDto as InventoryItemDetailsTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class InventoryItemDetailsTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: InventoryItemDetailsQueryResponseDto,
  })
  query: InventoryItemDetailsQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: InventoryItemDetailsMetaDto,
  })
  meta: InventoryItemDetailsMetaDto;
}
