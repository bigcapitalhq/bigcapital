import { ApiProperty } from '@nestjs/swagger';

export class BillPaymentTransactionDto {
  @ApiProperty({ description: 'The bill ID', example: 1 })
  billId: number;

  @ApiProperty({ description: 'The bill payment ID', example: 1 })
  billPaymentId: number;

  @ApiProperty({ description: 'The payment date', example: '2024-03-15' })
  paymentDate: string;

  @ApiProperty({
    description: 'The formatted payment date',
    example: '15/03/2024',
  })
  formattedPaymentDate: string;

  @ApiProperty({ description: 'The payment amount', example: 1000 })
  paymentAmount: number;

  @ApiProperty({
    description: 'The formatted payment amount',
    example: '$1,000.00',
  })
  formattedPaymentAmount: string;

  @ApiProperty({ description: 'The currency code', example: 'USD' })
  currencyCode: string;

  @ApiProperty({
    description: 'The payment reference number',
    example: 'PAY-001',
  })
  paymentNumber: string;

  @ApiProperty({
    description: 'The payment reference no.',
    example: 'REF-001',
    nullable: true,
  })
  paymentReferenceNo: string | null;

  @ApiProperty({ description: 'The bill number', example: 'BILL-001' })
  billNumber: string;

  @ApiProperty({
    description: 'The bill reference no.',
    example: 'REF-002',
    nullable: true,
  })
  billReferenceNo: string | null;

  @ApiProperty({ description: 'The payment account ID', example: 5 })
  paymentAccountId: number;

  @ApiProperty({
    description: 'The payment account name',
    example: 'Accounts Payable',
  })
  paymentAccountName: string;

  @ApiProperty({
    description: 'The payment account slug',
    example: 'accounts-payable',
  })
  paymentAccountSlug: string;
}
