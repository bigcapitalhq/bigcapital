import { ApiProperty } from '@nestjs/swagger';

export class InvoicePaymentTransactionDto {
  @ApiProperty({ description: 'The invoice ID', example: 1 })
  invoiceId: number;

  @ApiProperty({ description: 'The payment receive ID', example: 1 })
  paymentReceiveId: number;

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
    description: 'The payment receive number',
    example: 'RCV-001',
  })
  paymentNumber: string;

  @ApiProperty({
    description: 'The payment reference no.',
    example: 'REF-001',
    nullable: true,
  })
  paymentReferenceNo: string | null;

  @ApiProperty({ description: 'The invoice number', example: 'INV-001' })
  invoiceNumber: string;

  @ApiProperty({
    description: 'The invoice reference no.',
    example: 'REF-002',
    nullable: true,
  })
  invoiceReferenceNo: string | null;

  @ApiProperty({ description: 'The deposit account ID', example: 5 })
  depositAccountId: number;

  @ApiProperty({
    description: 'The deposit account name',
    example: 'Undeposited Funds',
  })
  depositAccountName: string;

  @ApiProperty({
    description: 'The deposit account slug',
    example: 'undeposited-funds',
  })
  depositAccountSlug: string;
}
