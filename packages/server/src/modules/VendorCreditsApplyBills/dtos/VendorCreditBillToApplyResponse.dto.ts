import { ApiProperty } from '@nestjs/swagger';

export class VendorCreditBillToApplyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'BILL-0001' })
  billNo: string;

  @ApiProperty({ example: '2024-01-10' })
  billDate: Date;

  @ApiProperty({ example: '2024-01-20' })
  dueDate: Date;

  @ApiProperty({ example: 500 })
  amount: number;

  @ApiProperty({ example: 500 })
  dueAmount: number;

  @ApiProperty({ example: 0 })
  paymentAmount: number;

  @ApiProperty({ example: 'PO-001', required: false, nullable: true })
  referenceNo?: string | null;

  @ApiProperty({ example: 'USD', required: false, nullable: true })
  currencyCode?: string | null;

  @ApiProperty({ example: '2024-01-10' })
  formattedBillDate: string;

  @ApiProperty({ example: '2024-01-20' })
  formattedDueDate: string;

  @ApiProperty({ example: '$500.00' })
  formattedAmount: string;

  @ApiProperty({ example: '$500.00' })
  formattedDueAmount: string;

  @ApiProperty({ example: '$0.00' })
  formattedPaymentAmount: string;
}
