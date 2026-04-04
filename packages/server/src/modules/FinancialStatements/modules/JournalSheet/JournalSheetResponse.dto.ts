import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class JournalEntryDto {
  @ApiProperty({ description: 'Entry index', type: Number })
  index: number;

  @ApiPropertyOptional({ description: 'Entry note' })
  note: string | null;

  @ApiPropertyOptional({ description: 'Contact name' })
  contactName?: string;

  @ApiPropertyOptional({ description: 'Contact type' })
  contactType?: string;

  @ApiProperty({ description: 'Account name' })
  accountName: string;

  @ApiProperty({ description: 'Account code' })
  accountCode: string;

  @ApiPropertyOptional({ description: 'Transaction number' })
  transactionNumber: string | null;

  @ApiProperty({ description: 'Formatted credit' })
  formattedCredit: string;

  @ApiProperty({ description: 'Formatted debit' })
  formattedDebit: string;

  @ApiProperty({ description: 'Credit amount', type: Number })
  credit: number;

  @ApiProperty({ description: 'Debit amount', type: Number })
  debit: number;
}

export class JournalTransactionDto {
  @ApiProperty({ description: 'Transaction date' })
  date: string;

  @ApiProperty({ description: 'Formatted date' })
  dateFormatted: string;

  @ApiProperty({ description: 'Transaction type' })
  transactionType: string;

  @ApiProperty({ description: 'Reference ID', type: Number })
  referenceId: number;

  @ApiProperty({ description: 'Formatted reference type' })
  referenceTypeFormatted: string;

  @ApiProperty({ description: 'Journal entries', type: [JournalEntryDto] })
  entries: JournalEntryDto[];

  @ApiProperty({ description: 'Total credit', type: Number })
  credit: number;

  @ApiProperty({ description: 'Total debit', type: Number })
  debit: number;

  @ApiProperty({ description: 'Formatted total credit' })
  formattedCredit: string;

  @ApiProperty({ description: 'Formatted total debit' })
  formattedDebit: string;
}

export class JournalSheetMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class JournalSheetQueryResponseDto {
  @ApiProperty({ description: 'Start date' })
  fromDate: string;

  @ApiProperty({ description: 'End date' })
  toDate: string;

  @ApiPropertyOptional({ description: 'From range' })
  fromRange: number | null;

  @ApiPropertyOptional({ description: 'To range' })
  toRange: number | null;

  @ApiProperty({ description: 'Account IDs to include', type: [Number] })
  accountsIds: number[];

  @ApiProperty({ description: 'Number format settings', type: Object })
  numberFormat: {
    noCents: boolean;
    divideOn1000: boolean;
  };
}

export class JournalSheetResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: JournalSheetQueryResponseDto,
  })
  query: JournalSheetQueryResponseDto;

  @ApiProperty({
    description: 'Journal transactions',
    type: [JournalTransactionDto],
  })
  data: JournalTransactionDto[];

  @ApiProperty({ description: 'Report metadata', type: JournalSheetMetaDto })
  meta: JournalSheetMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as JournalSheetTableCellDto,
  FinancialTableRowDto as JournalSheetTableRowDto,
  FinancialTableColumnDto as JournalSheetTableColumnDto,
  FinancialTableDataDto as JournalSheetTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class JournalSheetTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: JournalSheetQueryResponseDto,
  })
  query: JournalSheetQueryResponseDto;

  @ApiProperty({ description: 'Report metadata', type: JournalSheetMetaDto })
  meta: JournalSheetMetaDto;
}
