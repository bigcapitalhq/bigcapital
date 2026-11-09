import { ApiProperty } from '@nestjs/swagger';

export class BillPaymentPageEntryDto {
  @ApiProperty({ description: 'The bill ID', example: 1 })
  billId: number;

  @ApiProperty({ description: 'The entry type', example: 'invoice' })
  entryType: string;

  @ApiProperty({ description: 'The bill number', example: 'BILL-001' })
  billNo: string;

  @ApiProperty({ description: 'The total bill amount', example: 2000 })
  amount: number;

  @ApiProperty({ description: 'The outstanding due amount', example: 1500 })
  dueAmount: number;

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

  @ApiProperty({ description: 'The bill date', example: '2024-03-15' })
  date: string;
}
