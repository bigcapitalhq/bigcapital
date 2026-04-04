import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class InventoryValuationItemDto {
  @ApiProperty({ description: 'Item ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Item name' })
  name: string;

  @ApiProperty({ description: 'Item code' })
  code: string;

  @ApiProperty({ description: 'Item type' })
  type: string;

  @ApiPropertyOptional({ description: 'Quantity on hand', type: Number })
  quantityOnHand?: number;

  @ApiPropertyOptional({ description: 'Average cost', type: Number })
  averageCost?: number;

  @ApiPropertyOptional({
    description: 'Total value',
    type: FinancialReportTotalDto,
  })
  totalValue?: FinancialReportTotalDto;

  @ApiPropertyOptional({ description: 'Asset account name' })
  assetAccountName?: string;

  @ApiPropertyOptional({ description: 'Asset account code' })
  assetAccountCode?: string;
}

export class InventoryValuationMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted as-of date' })
  formattedAsDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class InventoryValuationQueryResponseDto {
  @ApiProperty({ description: 'As-of date' })
  asDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Item IDs to include', type: [Number] })
  itemsIds: number[];

  @ApiProperty({ description: 'Exclude zero quantity items' })
  noneZero: boolean;
}

export class InventoryValuationResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: InventoryValuationQueryResponseDto,
  })
  query: InventoryValuationQueryResponseDto;

  @ApiProperty({
    description: 'Inventory items valuation',
    type: [InventoryValuationItemDto],
  })
  data: InventoryValuationItemDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: InventoryValuationMetaDto,
  })
  meta: InventoryValuationMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as InventoryValuationTableCellDto,
  FinancialTableRowDto as InventoryValuationTableRowDto,
  FinancialTableColumnDto as InventoryValuationTableColumnDto,
  FinancialTableDataDto as InventoryValuationTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class InventoryValuationTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: InventoryValuationQueryResponseDto,
  })
  query: InventoryValuationQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: InventoryValuationMetaDto,
  })
  meta: InventoryValuationMetaDto;
}
