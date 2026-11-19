import { ApiProperty } from '@nestjs/swagger';

export class BankReconciliationTransactionResponseDto {
  @ApiProperty({ description: 'Stable transaction key' })
  key: string;

  @ApiProperty({ description: 'Account transaction id', nullable: true })
  accountTransactionId: number | null;

  @ApiProperty({ description: 'Ledger reference type' })
  referenceType: string;

  @ApiProperty({ description: 'Ledger reference id' })
  referenceId: number;

  @ApiProperty({ description: 'Ledger line index' })
  index: number;

  @ApiProperty({ description: 'Transaction date' })
  date: string;

  @ApiProperty({ description: 'Formatted transaction date' })
  formattedDate: string;

  @ApiProperty({ description: 'Transaction type', nullable: true })
  transactionType: string | null;

  @ApiProperty({ description: 'Transaction number', nullable: true })
  transactionNumber: string | null;

  @ApiProperty({ description: 'Reference number', nullable: true })
  referenceNumber: string | null;

  @ApiProperty({ description: 'Transaction note', nullable: true })
  note: string | null;

  @ApiProperty({ description: 'Credit amount' })
  credit: number;

  @ApiProperty({ description: 'Formatted credit amount' })
  formattedCredit: string;

  @ApiProperty({ description: 'Debit amount' })
  debit: number;

  @ApiProperty({ description: 'Formatted debit amount' })
  formattedDebit: string;

  @ApiProperty({
    description: 'Transaction status',
    enum: ['categorized', 'matched', 'manual'],
  })
  status: string;

  @ApiProperty({ description: 'Whether the transaction came from a bank feed' })
  isBankFeed: boolean;

  @ApiProperty({
    description: 'Whether the transaction is from a previous period',
  })
  isPreviousOutstanding: boolean;

  @ApiProperty({ description: 'Whether the transaction is checked/cleared' })
  isChecked: boolean;

  @ApiProperty({ description: 'Whether the transaction is reconciled' })
  isReconciled: boolean;

  @ApiProperty({
    description: 'Related uncategorized bank transaction ids',
    type: [Number],
  })
  uncategorizedTransactionIds: number[];
}
