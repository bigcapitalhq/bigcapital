import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class VendorTransactionDto {
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

export class VendorWithTransactionsDto {
  @ApiProperty({ description: 'Vendor ID', type: Number })
  vendorId: number;

  @ApiProperty({ description: 'Vendor name' })
  vendorName: string;

  @ApiPropertyOptional({
    description: 'Opening balance',
    type: FinancialReportTotalDto,
  })
  openingBalance?: FinancialReportTotalDto;

  @ApiProperty({
    description: 'Vendor transactions',
    type: [VendorTransactionDto],
  })
  transactions: VendorTransactionDto[];

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

export class TransactionsByVendorMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class TransactionsByVendorQueryResponseDto {
  @ApiProperty({ description: 'Start date' })
  fromDate: string;

  @ApiProperty({ description: 'End date' })
  toDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Vendor IDs to include', type: [Number] })
  vendorsIds: number[];

  @ApiProperty({ description: 'Exclude zero balance vendors' })
  noneZero: boolean;
}

export class TransactionsByVendorResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: TransactionsByVendorQueryResponseDto,
  })
  query: TransactionsByVendorQueryResponseDto;

  @ApiProperty({
    description: 'Vendors with transactions',
    type: [VendorWithTransactionsDto],
  })
  data: VendorWithTransactionsDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: TransactionsByVendorMetaDto,
  })
  meta: TransactionsByVendorMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as TransactionsByVendorTableCellDto,
  FinancialTableRowDto as TransactionsByVendorTableRowDto,
  FinancialTableColumnDto as TransactionsByVendorTableColumnDto,
  FinancialTableDataDto as TransactionsByVendorTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class TransactionsByVendorTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: TransactionsByVendorQueryResponseDto,
  })
  query: TransactionsByVendorQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: TransactionsByVendorMetaDto,
  })
  meta: TransactionsByVendorMetaDto;
}
