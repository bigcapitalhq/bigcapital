import { ApiProperty } from '@nestjs/swagger';

export class PaymentReceivePageEntryDto {
  @ApiProperty({ description: 'The invoice ID', example: 1 })
  invoiceId: number;

  @ApiProperty({ description: 'The entry type', example: 'invoice' })
  entryType: string;

  @ApiProperty({ description: 'The invoice number', example: 'INV-001' })
  invoiceNo: string;

  @ApiProperty({ description: 'The outstanding due amount', example: 1500 })
  dueAmount: number;

  @ApiProperty({ description: 'The total invoice amount', example: 2000 })
  amount: number;

  @ApiProperty({
    description: 'The total payment amount applied',
    example: 500,
  })
  totalPaymentAmount: number;

  @ApiProperty({
    description: 'The payment amount for this entry',
    example: 500,
  })
  paymentAmount: number;

  @ApiProperty({ description: 'The currency code', example: 'USD' })
  currencyCode: string;

  @ApiProperty({ description: 'The invoice date', example: '2024-03-15' })
  date: string;
}
