import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class ItemInvoiceResponseDto {
  @ApiProperty({
    example: 123,
    description: 'The unique identifier of the invoice.',
  })
  invoiceId: number;

  @ApiProperty({ example: 'INV-2024-001', description: 'The invoice number.' })
  invoiceNumber: string;

  @ApiProperty({
    example: 'REF-2024-001',
    description: 'The reference number of the invoice.',
  })
  referenceNumber: string;

  @ApiProperty({
    example: '2024-06-01',
    description: 'The date of the invoice.',
  })
  invoiceDate: string;

  @ApiProperty({
    example: '01/06/2024',
    description: 'The formatted date of the invoice.',
  })
  formattedInvoiceDate: string;

  @ApiProperty({
    example: 1000,
    description: 'The amount of the invoice item.',
  })
  amount: number;

  @ApiProperty({
    example: '$1,000.00',
    description: 'The formatted amount of the invoice item.',
  })
  formattedAmount: string;

  @ApiProperty({
    example: 5,
    description: 'The quantity of the item in the invoice.',
  })
  quantity: number;

  @ApiProperty({
    example: '5',
    description: 'The formatted quantity of the item in the invoice.',
  })
  formattedQuantity: string;

  @ApiProperty({
    example: 200,
    description: 'The rate of the item in the invoice.',
  })
  rate: number;

  @ApiProperty({
    example: '$200.00',
    description: 'The formatted rate of the item in the invoice.',
  })
  formattedRate: string;

  @ApiProperty({
    example: 'Acme Corp',
    description: 'The display name of the customer.',
  })
  customerDisplayName: string;

  @ApiProperty({
    example: 'USD',
    description: 'The currency code of the customer.',
  })
  customerCurrencyCode: string;
}
