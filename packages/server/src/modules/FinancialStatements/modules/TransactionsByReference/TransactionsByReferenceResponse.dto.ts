import { ApiProperty } from '@nestjs/swagger';
import { FinancialReportTotalDto } from '../../dtos/FinancialReportResponse.dto';

export class TransactionByReferenceDateDto {
  @ApiProperty({ description: 'Formatted date string' })
  formattedDate: string;

  @ApiProperty({ description: 'Raw transaction date', type: Date })
  date: Date;
}

export class TransactionByReferenceTransactionDto {
  @ApiProperty({
    description: 'Transaction date',
    type: TransactionByReferenceDateDto,
  })
  date: TransactionByReferenceDateDto;

  @ApiProperty({
    description: 'Credit amount',
    type: FinancialReportTotalDto,
  })
  credit: FinancialReportTotalDto;

  @ApiProperty({
    description: 'Debit amount',
    type: FinancialReportTotalDto,
  })
  debit: FinancialReportTotalDto;

  @ApiProperty({ description: 'Contact type' })
  contactType: string;

  @ApiProperty({ description: 'Formatted contact type' })
  formattedContactType: string;

  @ApiProperty({ description: 'Contact ID', type: Number })
  contactId: number;

  @ApiProperty({ description: 'Reference type' })
  referenceType: string;

  @ApiProperty({ description: 'Formatted reference type' })
  formattedReferenceType: string;

  @ApiProperty({ description: 'Reference ID', type: Number })
  referenceId: number;

  @ApiProperty({ description: 'Account name' })
  accountName: string;

  @ApiProperty({ description: 'Account code' })
  accountCode: string;

  @ApiProperty({ description: 'Account ID', type: Number })
  accountId: number;
}

export class TransactionsByReferenceResponseDto {
  @ApiProperty({
    description: 'Transactions linked to the given reference',
    type: [TransactionByReferenceTransactionDto],
  })
  transactions: TransactionByReferenceTransactionDto[];
}
