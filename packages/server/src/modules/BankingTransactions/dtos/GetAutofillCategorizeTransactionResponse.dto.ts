import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetAutofillCategorizeTransactionResponseDto {
  @ApiPropertyOptional({
    description: 'Assigned credit/debit account ID from recognition',
    example: 10,
  })
  creditAccountId?: number | null;

  @ApiPropertyOptional({
    description: 'Bank account ID (debit)',
    example: 5,
  })
  debitAccountId?: number | null;

  @ApiProperty({
    description: 'Total amount of uncategorized transactions',
    example: -150.5,
  })
  amount: number;

  @ApiProperty({ description: 'Formatted amount', example: '$150.50' })
  formattedAmount: string;

  @ApiProperty({ description: 'Transaction date', example: '2024-01-15' })
  date: string;

  @ApiProperty({ description: 'Formatted date', example: 'Jan 15, 2024' })
  formattedDate: string;

  @ApiProperty({
    description: 'Whether the transaction is recognized by a rule',
    example: true,
  })
  isRecognized: boolean;

  @ApiPropertyOptional({
    description: 'Bank rule ID that recognized the transaction',
    example: 1,
  })
  recognizedByRuleId?: number | null;

  @ApiPropertyOptional({
    description: 'Bank rule name that recognized the transaction',
    example: 'Salary Rule',
  })
  recognizedByRuleName?: string | null;

  @ApiPropertyOptional({ description: 'Reference number', example: 'REF-001' })
  referenceNo?: string | null;

  @ApiProperty({
    description: 'Transaction type (category)',
    example: 'other_expense',
  })
  transactionType: string;

  @ApiProperty({
    description: 'Whether this is a deposit transaction',
    example: false,
  })
  isDepositTransaction: boolean;

  @ApiProperty({
    description: 'Whether this is a withdrawal transaction',
    example: true,
  })
  isWithdrawalTransaction: boolean;

  @ApiPropertyOptional({ description: 'Assigned payee from recognition' })
  payee?: string | null;

  @ApiPropertyOptional({ description: 'Assigned memo from recognition' })
  memo?: string | null;
}
