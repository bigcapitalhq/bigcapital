import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class GeneralLedgerTransactionDto {
  @ApiProperty({ description: 'Transaction date' })
  date: string;

  @ApiProperty({ description: 'Formatted date' })
  dateFormatted: string;

  @ApiProperty({ description: 'Reference type' })
  referenceType: string;

  @ApiProperty({ description: 'Reference ID', type: Number })
  referenceId: number;

  @ApiPropertyOptional({ description: 'Transaction number' })
  transactionNumber: string | null;

  @ApiProperty({ description: 'Formatted transaction type' })
  transactionTypeFormatted: string;

  @ApiProperty({ description: 'Contact name' })
  contactName: string;

  @ApiProperty({ description: 'Contact type' })
  contactType: string;

  @ApiProperty({ description: 'Transaction type' })
  transactionType: string;

  @ApiProperty({ description: 'Transaction index', type: Number })
  index: number;

  @ApiPropertyOptional({ description: 'Transaction note' })
  note: string | null;

  @ApiProperty({ description: 'Credit amount', type: Number })
  credit: number;

  @ApiProperty({ description: 'Debit amount', type: Number })
  debit: number;

  @ApiProperty({ description: 'Transaction amount', type: Number })
  amount: number;

  @ApiProperty({ description: 'Running balance', type: Number })
  runningBalance: number;

  @ApiProperty({ description: 'Formatted amount' })
  formattedAmount: string;

  @ApiProperty({ description: 'Formatted credit' })
  formattedCredit: string;

  @ApiProperty({ description: 'Formatted debit' })
  formattedDebit: string;

  @ApiProperty({ description: 'Formatted running balance' })
  formattedRunningBalance: string;

  @ApiProperty({ description: 'Currency code' })
  currencyCode: string;
}

export class GeneralLedgerAccountDto {
  @ApiProperty({ description: 'Account ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Account name' })
  name: string;

  @ApiProperty({ description: 'Account code' })
  code: string;

  @ApiProperty({ description: 'Account index', type: Number })
  index: number;

  @ApiPropertyOptional({ description: 'Parent account ID', type: Number })
  parentAccountId: number | null;

  @ApiProperty({
    description: 'Opening balance',
    type: FinancialReportTotalDto,
  })
  openingBalance: FinancialReportTotalDto;

  @ApiProperty({
    description: 'Account transactions',
    type: [GeneralLedgerTransactionDto],
  })
  transactions: GeneralLedgerTransactionDto[];

  @ApiProperty({
    description: 'Closing balance',
    type: FinancialReportTotalDto,
  })
  closingBalance: FinancialReportTotalDto;
}

export class GeneralLedgerMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class GeneralLedgerQueryResponseDto {
  @ApiProperty({ description: 'Start date' })
  fromDate: string;

  @ApiProperty({ description: 'End date' })
  toDate: string;

  @ApiProperty({ description: 'Accounting basis', enum: ['cash', 'accrual'] })
  basis: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Exclude zero balance accounts' })
  noneZero: boolean;

  @ApiProperty({ description: 'Account IDs to include', type: [Number] })
  accountsIds: number[];
}

export class GeneralLedgerResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: GeneralLedgerQueryResponseDto,
  })
  query: GeneralLedgerQueryResponseDto;

  @ApiProperty({
    description: 'General ledger data',
    type: [GeneralLedgerAccountDto],
  })
  data: GeneralLedgerAccountDto[];

  @ApiProperty({ description: 'Report metadata', type: GeneralLedgerMetaDto })
  meta: GeneralLedgerMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as GeneralLedgerTableCellDto,
  FinancialTableRowDto as GeneralLedgerTableRowDto,
  FinancialTableColumnDto as GeneralLedgerTableColumnDto,
  FinancialTableDataDto as GeneralLedgerTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class GeneralLedgerTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: GeneralLedgerQueryResponseDto,
  })
  query: GeneralLedgerQueryResponseDto;

  @ApiProperty({ description: 'Report metadata', type: GeneralLedgerMetaDto })
  meta: GeneralLedgerMetaDto;
}
