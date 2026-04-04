import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportPercentageDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class BalanceSheetDataNodeDto {
  @ApiProperty({
    description: 'Node identifier (string for aggregates, number for accounts)',
  })
  id: string | number;

  @ApiProperty({ description: 'Account or category name' })
  name: string;

  @ApiProperty({
    description: 'Type of node',
    enum: ['AGGREGATE', 'ACCOUNTS', 'ACCOUNT', 'NET_INCOME'],
  })
  nodeType: string;

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
  horizontalTotals?: FinancialReportTotalDto[];

  @ApiPropertyOptional({
    description: 'Percentage of row',
    type: FinancialReportPercentageDto,
  })
  percentageRow?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Percentage of column',
    type: FinancialReportPercentageDto,
  })
  percentageColumn?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Previous period total',
    type: FinancialReportTotalDto,
  })
  previousPeriod?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Previous period change',
    type: FinancialReportTotalDto,
  })
  previousPeriodChange?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Previous period percentage',
    type: FinancialReportPercentageDto,
  })
  previousPeriodPercentage?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Previous year total',
    type: FinancialReportTotalDto,
  })
  previousYear?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Previous year change',
    type: FinancialReportTotalDto,
  })
  previousYearChange?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Previous year percentage',
    type: FinancialReportPercentageDto,
  })
  previousYearPercentage?: FinancialReportPercentageDto;

  @ApiPropertyOptional({ description: 'Account code' })
  code?: string;

  @ApiPropertyOptional({ description: 'Display index', type: Number })
  index?: number;

  @ApiPropertyOptional({ description: 'Parent account ID', type: Number })
  parentAccountId?: number;

  @ApiPropertyOptional({
    description: 'Child nodes',
    type: () => [BalanceSheetDataNodeDto],
  })
  children?: BalanceSheetDataNodeDto[];
}

export class BalanceSheetMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted as-of date' })
  formattedAsDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class BalanceSheetQueryResponseDto {
  @ApiProperty({
    description: 'Column display type',
    enum: ['total', 'date_periods'],
  })
  displayColumnsType: string;

  @ApiProperty({
    description: 'Column grouping',
    enum: ['day', 'month', 'year', 'quarter'],
  })
  displayColumnsBy: string;

  @ApiProperty({ description: 'Start date' })
  fromDate: string;

  @ApiProperty({ description: 'End date' })
  toDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Exclude zero balance accounts' })
  noneZero: boolean;

  @ApiProperty({ description: 'Exclude accounts with no transactions' })
  noneTransactions: boolean;

  @ApiProperty({ description: 'Accounting basis', enum: ['cash', 'accrual'] })
  basis: string;

  @ApiProperty({ description: 'Account IDs to include', type: [Number] })
  accountIds: number[];

  @ApiProperty({ description: 'Show percentage of column' })
  percentageOfColumn: boolean;

  @ApiProperty({ description: 'Show percentage of row' })
  percentageOfRow: boolean;

  @ApiProperty({ description: 'Include previous period' })
  previousPeriod: boolean;

  @ApiProperty({ description: 'Show previous period amount change' })
  previousPeriodAmountChange: boolean;

  @ApiProperty({ description: 'Show previous period percentage change' })
  previousPeriodPercentageChange: boolean;

  @ApiProperty({ description: 'Include previous year' })
  previousYear: boolean;

  @ApiProperty({ description: 'Show previous year amount change' })
  previousYearAmountChange: boolean;

  @ApiProperty({ description: 'Show previous year percentage change' })
  previousYearPercentageChange: boolean;
}

export class BalanceSheetResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: BalanceSheetQueryResponseDto,
  })
  query: BalanceSheetQueryResponseDto;

  @ApiProperty({
    description: 'Hierarchical balance sheet data',
    type: [BalanceSheetDataNodeDto],
  })
  data: BalanceSheetDataNodeDto[];

  @ApiProperty({ description: 'Report metadata', type: BalanceSheetMetaDto })
  meta: BalanceSheetMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as BalanceSheetTableCellDto,
  FinancialTableRowDto as BalanceSheetTableRowDto,
  FinancialTableColumnDto as BalanceSheetTableColumnDto,
  FinancialTableDataDto as BalanceSheetTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class BalanceSheetTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: BalanceSheetQueryResponseDto,
  })
  query: BalanceSheetQueryResponseDto;

  @ApiProperty({ description: 'Report metadata', type: BalanceSheetMetaDto })
  meta: BalanceSheetMetaDto;
}
