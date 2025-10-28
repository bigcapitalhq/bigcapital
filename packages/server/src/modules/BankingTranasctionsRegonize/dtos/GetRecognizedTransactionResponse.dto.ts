import { ApiProperty } from '@nestjs/swagger';

export class GetRecognizedTransactionResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the uncategorized transaction',
    example: 123,
  })
  uncategorizedTransactionId: number;

  @ApiProperty({
    description: 'The reference number of the transaction',
    example: 'TRX-2024-001',
  })
  referenceNo: string;

  @ApiProperty({
    description: 'The description of the transaction',
    example: 'Payment for invoice #123',
  })
  description: string;

  @ApiProperty({
    description: 'The payee of the transaction',
    example: 'John Doe',
  })
  payee: string;

  @ApiProperty({
    description: 'The amount of the transaction',
    example: 1500.75,
  })
  amount: number;

  @ApiProperty({
    description: 'The formatted amount of the transaction',
    example: '$1,500.75',
  })
  formattedAmount: string;

  @ApiProperty({
    description: 'The date of the transaction',
    example: '2024-04-01',
  })
  date: string;

  @ApiProperty({
    description: 'The formatted date of the transaction',
    example: 'Apr 1, 2024',
  })
  formattedDate: string;

  @ApiProperty({ description: 'The assigned account ID', example: 10 })
  assignedAccountId: number;

  @ApiProperty({
    description: 'The assigned account name',
    example: 'Bank Account',
  })
  assignedAccountName: string;

  @ApiProperty({ description: 'The assigned account code', example: '1001' })
  assignedAccountCode: string;

  @ApiProperty({ description: 'The assigned payee', example: 'Jane Smith' })
  assignedPayee: string;

  @ApiProperty({ description: 'The assigned memo', example: 'Office supplies' })
  assignedMemo: string;

  @ApiProperty({
    description: 'The assigned category',
    example: 'Office Expenses',
  })
  assignedCategory: string;

  @ApiProperty({
    description: 'The formatted assigned category',
    example: 'Other Income',
  })
  assignedCategoryFormatted: string;

  @ApiProperty({ description: 'The withdrawal amount', example: 500 })
  withdrawal: number;

  @ApiProperty({ description: 'The deposit amount', example: 1000 })
  deposit: number;

  @ApiProperty({
    description: 'Whether this is a deposit transaction',
    example: true,
  })
  isDepositTransaction: boolean;

  @ApiProperty({
    description: 'Whether this is a withdrawal transaction',
    example: false,
  })
  isWithdrawalTransaction: boolean;

  @ApiProperty({
    description: 'The formatted deposit amount',
    example: '$1,000.00',
  })
  formattedDepositAmount: string;

  @ApiProperty({
    description: 'The formatted withdrawal amount',
    example: '$500.00',
  })
  formattedWithdrawalAmount: string;

  @ApiProperty({ description: 'The bank rule ID', example: 'BR-001' })
  bankRuleId: string;

  @ApiProperty({ description: 'The bank rule name', example: 'Salary Rule' })
  bankRuleName: string;
}
