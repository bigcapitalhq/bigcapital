import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class CashflowStatementDataNodeDto {
  @ApiProperty({
    description: 'Node identifier (string for aggregates, number for accounts)',
  })
  id: string | number;

  @ApiProperty({ description: 'Account or category name' })
  name: string;

  @ApiProperty({
    description: 'Type of node',
    enum: ['AGGREGATE', 'ACCOUNT', 'NET_INCOME', 'TOTAL'],
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

  @ApiPropertyOptional({ description: 'Account code' })
  code?: string;

  @ApiPropertyOptional({ description: 'Display index', type: Number })
  index?: number;

  @ApiPropertyOptional({
    description: 'Child nodes',
    type: () => [CashflowStatementDataNodeDto],
  })
  children?: CashflowStatementDataNodeDto[];
}

export class CashflowStatementMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class CashflowStatementQueryResponseDto {
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
}

export class CashflowStatementResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: CashflowStatementQueryResponseDto,
  })
  query: CashflowStatementQueryResponseDto;

  @ApiProperty({
    description: 'Hierarchical cashflow data',
    type: [CashflowStatementDataNodeDto],
  })
  data: CashflowStatementDataNodeDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: CashflowStatementMetaDto,
  })
  meta: CashflowStatementMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as CashflowStatementTableCellDto,
  FinancialTableRowDto as CashflowStatementTableRowDto,
  FinancialTableColumnDto as CashflowStatementTableColumnDto,
  FinancialTableDataDto as CashflowStatementTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class CashflowStatementTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: CashflowStatementQueryResponseDto,
  })
  query: CashflowStatementQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: CashflowStatementMetaDto,
  })
  meta: CashflowStatementMetaDto;
}
