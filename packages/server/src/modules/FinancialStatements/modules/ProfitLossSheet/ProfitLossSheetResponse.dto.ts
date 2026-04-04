import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportPercentageDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class ProfitLossSheetDataNodeDto {
  @ApiProperty({
    description: 'Node identifier (string for aggregates, number for accounts)',
  })
  id: string | number;

  @ApiProperty({ description: 'Account or category name' })
  name: string;

  @ApiProperty({
    description: 'Type of node',
    enum: ['ACCOUNTS', 'ACCOUNT', 'EQUATION', 'TOTAL'],
  })
  node_type: string;

  @ApiPropertyOptional({ description: 'Node type alias' })
  type?: string;

  @ApiProperty({
    description: 'Total amount information',
    type: FinancialReportTotalDto,
  })
  total: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Horizontal totals for date periods',
    type: [FinancialReportTotalDto],
  })
  horizontal_totals?: FinancialReportTotalDto[];

  @ApiPropertyOptional({
    description: 'Percentage of income',
    type: FinancialReportPercentageDto,
  })
  percentage_income?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Percentage of expense',
    type: FinancialReportPercentageDto,
  })
  percentage_expense?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Percentage of row',
    type: FinancialReportPercentageDto,
  })
  percentage_row?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Percentage of column',
    type: FinancialReportPercentageDto,
  })
  percentage_column?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Previous period total',
    type: FinancialReportTotalDto,
  })
  previous_period?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Previous period change',
    type: FinancialReportTotalDto,
  })
  previous_period_change?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Previous period percentage',
    type: FinancialReportPercentageDto,
  })
  previous_period_percentage?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Previous year total',
    type: FinancialReportTotalDto,
  })
  previous_year?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Previous year change',
    type: FinancialReportTotalDto,
  })
  previous_year_change?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Previous year percentage',
    type: FinancialReportPercentageDto,
  })
  previous_year_percentage?: FinancialReportPercentageDto;

  @ApiPropertyOptional({ description: 'Account code' })
  code?: string;

  @ApiPropertyOptional({ description: 'Display index', type: Number })
  index?: number;

  @ApiPropertyOptional({
    description: 'Child nodes',
    type: () => [ProfitLossSheetDataNodeDto],
  })
  children?: ProfitLossSheetDataNodeDto[];
}

export class ProfitLossSheetMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formatted_from_date: string;

  @ApiProperty({ description: 'Formatted to date' })
  formatted_to_date: string;

  @ApiProperty({ description: 'Formatted date range' })
  formatted_date_range: string;
}

export class ProfitLossSheetQueryResponseDto {
  @ApiProperty({
    description: 'Column display type',
    enum: ['total', 'date_periods'],
  })
  display_columns_type: string;

  @ApiProperty({
    description: 'Column grouping',
    enum: ['day', 'month', 'year', 'quarter'],
  })
  display_columns_by: string;

  @ApiProperty({ description: 'Start date' })
  from_date: string;

  @ApiProperty({ description: 'End date' })
  to_date: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  number_format: NumberFormatQueryDto;

  @ApiProperty({ description: 'Exclude zero balance accounts' })
  none_zero: boolean;

  @ApiProperty({ description: 'Exclude accounts with no transactions' })
  none_transactions: boolean;

  @ApiProperty({ description: 'Accounting basis', enum: ['cash', 'accrual'] })
  basis: string;

  @ApiProperty({ description: 'Account IDs to include', type: [Number] })
  accounts_ids: number[];

  @ApiProperty({ description: 'Show percentage of column' })
  percentage_column: boolean;

  @ApiProperty({ description: 'Show percentage of row' })
  percentage_row: boolean;

  @ApiProperty({ description: 'Show percentage of income' })
  percentage_income: boolean;

  @ApiProperty({ description: 'Show percentage of expense' })
  percentage_expense: boolean;

  @ApiProperty({ description: 'Include previous period' })
  previous_period: boolean;

  @ApiProperty({ description: 'Show previous period amount change' })
  previous_period_amount_change: boolean;

  @ApiProperty({ description: 'Show previous period percentage change' })
  previous_period_percentage_change: boolean;

  @ApiProperty({ description: 'Include previous year' })
  previous_year: boolean;

  @ApiProperty({ description: 'Show previous year amount change' })
  previous_year_amount_change: boolean;

  @ApiProperty({ description: 'Show previous year percentage change' })
  previous_year_percentage_change: boolean;
}

export class ProfitLossSheetResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: ProfitLossSheetQueryResponseDto,
  })
  query: ProfitLossSheetQueryResponseDto;

  @ApiProperty({
    description: 'Hierarchical profit/loss data',
    type: [ProfitLossSheetDataNodeDto],
  })
  data: ProfitLossSheetDataNodeDto[];

  @ApiProperty({ description: 'Report metadata', type: ProfitLossSheetMetaDto })
  meta: ProfitLossSheetMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as ProfitLossSheetTableCellDto,
  FinancialTableRowDto as ProfitLossSheetTableRowDto,
  FinancialTableColumnDto as ProfitLossSheetTableColumnDto,
  FinancialTableDataDto as ProfitLossSheetTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class ProfitLossSheetTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: ProfitLossSheetQueryResponseDto,
  })
  query: ProfitLossSheetQueryResponseDto;

  @ApiProperty({ description: 'Report metadata', type: ProfitLossSheetMetaDto })
  meta: ProfitLossSheetMetaDto;
}
