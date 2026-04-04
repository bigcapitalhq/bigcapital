import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class SalesByItemDto {
  @ApiProperty({ description: 'Item ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Item name' })
  name: string;

  @ApiProperty({ description: 'Item code' })
  code: string;

  @ApiProperty({ description: 'Item type' })
  type: string;

  @ApiProperty({ description: 'Quantity sold', type: Number })
  quantity: number;

  @ApiProperty({
    description: 'Total sales amount',
    type: FinancialReportTotalDto,
  })
  total: FinancialReportTotalDto;

  @ApiPropertyOptional({ description: 'Average price', type: Number })
  averagePrice?: number;

  @ApiPropertyOptional({ description: 'COGS', type: FinancialReportTotalDto })
  cogs?: FinancialReportTotalDto;

  @ApiPropertyOptional({ description: 'Profit', type: FinancialReportTotalDto })
  profit?: FinancialReportTotalDto;

  @ApiPropertyOptional({ description: 'Profit percentage', type: Number })
  profitPercentage?: number;
}

export class SalesByItemsMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class SalesByItemsQueryResponseDto {
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

  @ApiProperty({ description: 'Customer IDs to include', type: [Number] })
  customersIds: number[];
}

export class SalesByItemsResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: SalesByItemsQueryResponseDto,
  })
  query: SalesByItemsQueryResponseDto;

  @ApiProperty({ description: 'Sales by items', type: [SalesByItemDto] })
  data: SalesByItemDto[];

  @ApiProperty({ description: 'Report metadata', type: SalesByItemsMetaDto })
  meta: SalesByItemsMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as SalesByItemsTableCellDto,
  FinancialTableRowDto as SalesByItemsTableRowDto,
  FinancialTableColumnDto as SalesByItemsTableColumnDto,
  FinancialTableDataDto as SalesByItemsTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class SalesByItemsTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: SalesByItemsQueryResponseDto,
  })
  query: SalesByItemsQueryResponseDto;

  @ApiProperty({ description: 'Report metadata', type: SalesByItemsMetaDto })
  meta: SalesByItemsMetaDto;
}
