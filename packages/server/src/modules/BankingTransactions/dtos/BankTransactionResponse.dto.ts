import { ApiProperty } from '@nestjs/swagger';

export class BankTransactionResponseDto {
  @ApiProperty({
    description: 'The withdrawal amount',
    example: 1000.5,
    type: Number,
  })
  withdrawal: number;

  @ApiProperty({
    description: 'The deposit amount',
    example: 2000.75,
    type: Number,
  })
  deposit: number;

  @ApiProperty({
    description: 'The running balance after the transaction',
    example: 3000.25,
    type: Number,
  })
  runningBalance: number;

  @ApiProperty({
    description: 'Formatted withdrawal amount with currency symbol',
    example: '$1,000.50',
    type: String,
  })
  formattedWithdrawal: string;

  @ApiProperty({
    description: 'Formatted deposit amount with currency symbol',
    example: '$2,000.75',
    type: String,
  })
  formattedDeposit: string;

  @ApiProperty({
    description: 'Formatted running balance with currency symbol',
    example: '$3,000.25',
    type: String,
  })
  formattedRunningBalance: string;

  @ApiProperty({
    description: 'Unique transaction number',
    example: 'TRX-2024-001',
    type: String,
  })
  transactionNumber: string;

  @ApiProperty({
    description: 'Reference number for the transaction',
    example: 'REF-2024-001',
    type: String,
  })
  referenceNumber: string;

  @ApiProperty({
    description: 'ID of the reference entity',
    example: 12345,
    type: Number,
  })
  referenceId: number;

  @ApiProperty({
    description: 'Type of the reference entity',
    example: 'INVOICE',
    type: String,
  })
  referenceType: string;

  @ApiProperty({
    description: 'Formatted transaction type',
    example: 'Bank Transfer',
    type: String,
  })
  formattedTransactionType: string;

  @ApiProperty({
    description: 'Current balance',
    example: 5000.0,
    type: Number,
  })
  balance: number;

  @ApiProperty({
    description: 'Formatted balance with currency symbol',
    example: '$5,000.00',
    type: String,
  })
  formattedBalance: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-03-20T10:30:00Z',
    type: Date,
  })
  date: Date;

  @ApiProperty({
    description: 'Formatted transaction date',
    example: 'March 20, 2024',
    type: String,
  })
  formattedDate: string;

  @ApiProperty({
    description: 'Transaction status',
    example: 'COMPLETED',
    type: String,
  })
  status: string;

  @ApiProperty({
    description: 'Formatted transaction status',
    example: 'Completed',
    type: String,
  })
  formattedStatus: string;

  @ApiProperty({
    description: 'ID of the uncategorized transaction',
    example: 67890,
    type: Number,
  })
  uncategorizedTransactionId: number;
}
