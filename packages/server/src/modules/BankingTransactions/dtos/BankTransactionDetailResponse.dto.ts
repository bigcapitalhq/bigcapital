import { ApiProperty } from '@nestjs/swagger';
import { AccountResponseDto } from '@/modules/Accounts/dtos/AccountResponse.dto';

class BankTransactionDetailContactDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  displayName: string;
}

class BankTransactionDetailEntryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 100 })
  credit: number;

  @ApiProperty({ example: 0 })
  debit: number;

  @ApiProperty({ type: () => AccountResponseDto })
  account: AccountResponseDto;

  @ApiProperty({
    type: BankTransactionDetailContactDto,
    required: false,
    nullable: true,
  })
  contact?: BankTransactionDetailContactDto | null;
}

export class BankTransactionDetailResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'deposit' })
  transactionType: string;

  @ApiProperty({ example: 'Deposit' })
  transactionTypeFormatted: string;

  @ApiProperty({ example: 1000 })
  amount: number;

  @ApiProperty({ example: '$1,000.00' })
  formattedAmount: string;

  @ApiProperty({ example: 'USD' })
  currencyCode: string;

  @ApiProperty({ example: 1 })
  exchangeRate: number;

  @ApiProperty({ example: '2024-01-15T00:00:00Z' })
  date: Date;

  @ApiProperty({ example: '2024-01-15' })
  formattedDate: string;

  @ApiProperty({ example: '2024-01-15T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15' })
  formattedCreatedAt: string;

  @ApiProperty({ example: 'TRX-2024-001' })
  transactionNumber: string;

  @ApiProperty({ example: 'REF-001', required: false, nullable: true })
  referenceNo?: string | null;

  @ApiProperty({
    example: 'Transaction statement',
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ example: 12, required: false, nullable: true })
  uncategorizedTransactionId?: number | null;

  @ApiProperty({ example: 5 })
  cashflowAccountId: number;

  @ApiProperty({ example: 6 })
  creditAccountId: number;

  @ApiProperty({ example: 1, required: false, nullable: true })
  branchId?: number | null;

  @ApiProperty({ type: [BankTransactionDetailEntryDto] })
  transactions: BankTransactionDetailEntryDto[];
}
