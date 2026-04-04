import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class TrialBalanceSheetAccountDto {
  @ApiProperty({ description: 'Account ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Account name' })
  name: string;

  @ApiProperty({ description: 'Account code' })
  code: string;

  @ApiPropertyOptional({
    description: 'Opening balance',
    type: FinancialReportTotalDto,
  })
  openingBalance?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Closing balance',
    type: FinancialReportTotalDto,
  })
  closingBalance?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Debit total',
    type: FinancialReportTotalDto,
  })
  debitTotal?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Credit total',
    type: FinancialReportTotalDto,
  })
  creditTotal?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Debit/change',
    type: FinancialReportTotalDto,
  })
  debit?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Credit/change',
    type: FinancialReportTotalDto,
  })
  credit?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Period balance',
    type: FinancialReportTotalDto,
  })
  periodBalance?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Account normal',
    enum: ['debit', 'credit'],
  })
  accountNormal?: string;

  @ApiPropertyOptional({ description: 'Account index', type: Number })
  index?: number;
}

export class TrialBalanceSheetMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;

  @ApiPropertyOptional({ description: 'Opening balance at', type: Date })
  openingBalanceAt?: Date;

  @ApiPropertyOptional({ description: 'Closing balance at', type: Date })
  closingBalanceAt?: Date;

  @ApiPropertyOptional({ description: 'Formatted opening balance date' })
  formattedOpeningBalanceDate?: string;

  @ApiPropertyOptional({ description: 'Formatted closing balance date' })
  formattedClosingBalanceDate?: string;
}

export class TrialBalanceSheetQueryResponseDto {
  @ApiProperty({ description: 'Start date' })
  fromDate: string;

  @ApiProperty({ description: 'End date' })
  toDate: string;

  @ApiProperty({ description: 'Account IDs to include', type: [Number] })
  accountIds: number[];

  @ApiProperty({ description: 'Exclude zero balance accounts' })
  noneZero: boolean;

  @ApiProperty({ description: 'Exclude accounts with no transactions' })
  noneTransactions: boolean;

  @ApiProperty({ description: 'Accounting basis', enum: ['cash', 'accrual'] })
  basis: string;

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
}

export class TrialBalanceSheetResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: TrialBalanceSheetQueryResponseDto,
  })
  query: TrialBalanceSheetQueryResponseDto;

  @ApiProperty({
    description: 'Trial balance sheet data',
    type: [TrialBalanceSheetAccountDto],
  })
  data: TrialBalanceSheetAccountDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: TrialBalanceSheetMetaDto,
  })
  meta: TrialBalanceSheetMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as TrialBalanceSheetTableCellDto,
  FinancialTableRowDto as TrialBalanceSheetTableRowDto,
  FinancialTableColumnDto as TrialBalanceSheetTableColumnDto,
  FinancialTableDataDto as TrialBalanceSheetTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class TrialBalanceSheetTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: TrialBalanceSheetQueryResponseDto,
  })
  query: TrialBalanceSheetQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: TrialBalanceSheetMetaDto,
  })
  meta: TrialBalanceSheetMetaDto;
}
