import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialTableColumnDto,
  FinancialReportTotalDto,
  FinancialReportPercentageDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';
import {
  PROFIT_LOSS_COLUMN_KEYS,
  ProfitLossColumnKey,
} from '../../common/constants/tableColumnKeys';

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
    description: 'Percentage of income',
    type: FinancialReportPercentageDto,
  })
  percentageIncome?: FinancialReportPercentageDto;

  @ApiPropertyOptional({
    description: 'Percentage of expense',
    type: FinancialReportPercentageDto,
  })
  percentageExpense?: FinancialReportPercentageDto;

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

  @ApiPropertyOptional({
    description: 'Child nodes',
    type: () => [ProfitLossSheetDataNodeDto],
  })
  children?: ProfitLossSheetDataNodeDto[];
}

export class ProfitLossSheetMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class ProfitLossSheetQueryResponseDto {
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
  accountsIds: number[];

  @ApiProperty({ description: 'Show percentage of column' })
  percentageColumn: boolean;

  @ApiProperty({ description: 'Show percentage of row' })
  percentageRow: boolean;

  @ApiProperty({ description: 'Show percentage of income' })
  percentageIncome: boolean;

  @ApiProperty({ description: 'Show percentage of expense' })
  percentageExpense: boolean;

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
} from '../../dtos/FinancialReportResponse.dto';

export class ProfitLossSheetTableColumnDto extends FinancialTableColumnDto {
  @ApiProperty({
    description: 'Column key',
    enum: Object.values(PROFIT_LOSS_COLUMN_KEYS),
  })
  key: ProfitLossColumnKey;
}

export class ProfitLossSheetTableDataDto extends FinancialTableDataDto {
  @ApiProperty({
    description: 'Table column definitions',
    type: [ProfitLossSheetTableColumnDto],
  })
  columns: ProfitLossSheetTableColumnDto[];
}

export class ProfitLossSheetTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => ProfitLossSheetTableDataDto,
  })
  table: ProfitLossSheetTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: ProfitLossSheetQueryResponseDto,
  })
  query: ProfitLossSheetQueryResponseDto;

  @ApiProperty({ description: 'Report metadata', type: ProfitLossSheetMetaDto })
  meta: ProfitLossSheetMetaDto;
}
