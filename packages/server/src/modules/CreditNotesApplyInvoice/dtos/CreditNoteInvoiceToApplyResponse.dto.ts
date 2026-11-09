import { ApiProperty } from '@nestjs/swagger';

export class CreditNoteInvoiceToApplyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'INV-0001' })
  invoiceNo: string;

  @ApiProperty({ example: 'REF-001', required: false, nullable: true })
  referenceNo?: string | null;

  @ApiProperty({ example: '2024-01-10' })
  invoiceDate: string;

  @ApiProperty({ example: '2024-01-20' })
  dueDate: string;

  @ApiProperty({ example: 'USD', required: false, nullable: true })
  currencyCode?: string | null;

  @ApiProperty({ example: 500 })
  balance: number;

  @ApiProperty({ example: 500 })
  dueAmount: number;

  @ApiProperty({ example: 0 })
  paymentAmount: number;

  @ApiProperty({ example: '2024-01-10' })
  formattedInvoiceDate: string;

  @ApiProperty({ example: '2024-01-20' })
  formattedDueDate: string;

  @ApiProperty({ example: '$500.00' })
  formattedAmount: string;

  @ApiProperty({ example: '$500.00' })
  formattedDueAmount: string;

  @ApiProperty({ example: '$0.00' })
  formattedPaymentAmount: string;
}
