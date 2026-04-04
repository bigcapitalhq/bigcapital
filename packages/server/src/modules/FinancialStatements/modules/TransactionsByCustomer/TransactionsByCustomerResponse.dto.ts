import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class CustomerTransactionDto {
  @ApiProperty({ description: 'Transaction date' })
  date: string;

  @ApiProperty({ description: 'Formatted date' })
  dateFormatted: string;

  @ApiProperty({ description: 'Transaction type' })
  transactionType: string;

  @ApiProperty({ description: 'Transaction number' })
  transactionNumber: string;

  @ApiPropertyOptional({ description: 'Reference type' })
  referenceType?: string;

  @ApiPropertyOptional({ description: 'Reference ID', type: Number })
  referenceId?: number;

  @ApiPropertyOptional({ description: 'Transaction description' })
  description?: string;

  @ApiProperty({
    description: 'Transaction amount',
    type: FinancialReportTotalDto,
  })
  amount: FinancialReportTotalDto;

  @ApiProperty({
    description: 'Running balance',
    type: FinancialReportTotalDto,
  })
  runningBalance: FinancialReportTotalDto;
}

export class CustomerWithTransactionsDto {
  @ApiProperty({ description: 'Customer ID', type: Number })
  customerId: number;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;

  @ApiPropertyOptional({
    description: 'Opening balance',
    type: FinancialReportTotalDto,
  })
  openingBalance?: FinancialReportTotalDto;

  @ApiProperty({
    description: 'Customer transactions',
    type: [CustomerTransactionDto],
  })
  transactions: CustomerTransactionDto[];

  @ApiProperty({
    description: 'Closing balance',
    type: FinancialReportTotalDto,
  })
  closingBalance: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Total debit',
    type: FinancialReportTotalDto,
  })
  totalDebit?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Total credit',
    type: FinancialReportTotalDto,
  })
  totalCredit?: FinancialReportTotalDto;
}

export class TransactionsByCustomerMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class TransactionsByCustomerQueryResponseDto {
  @ApiProperty({ description: 'Start date' })
  fromDate: string;

  @ApiProperty({ description: 'End date' })
  toDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Customer IDs to include', type: [Number] })
  customersIds: number[];

  @ApiProperty({ description: 'Exclude zero balance customers' })
  noneZero: boolean;
}

export class TransactionsByCustomerResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: TransactionsByCustomerQueryResponseDto,
  })
  query: TransactionsByCustomerQueryResponseDto;

  @ApiProperty({
    description: 'Customers with transactions',
    type: [CustomerWithTransactionsDto],
  })
  data: CustomerWithTransactionsDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: TransactionsByCustomerMetaDto,
  })
  meta: TransactionsByCustomerMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as TransactionsByCustomerTableCellDto,
  FinancialTableRowDto as TransactionsByCustomerTableRowDto,
  FinancialTableColumnDto as TransactionsByCustomerTableColumnDto,
  FinancialTableDataDto as TransactionsByCustomerTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class TransactionsByCustomerTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: TransactionsByCustomerQueryResponseDto,
  })
  query: TransactionsByCustomerQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: TransactionsByCustomerMetaDto,
  })
  meta: TransactionsByCustomerMetaDto;
}
