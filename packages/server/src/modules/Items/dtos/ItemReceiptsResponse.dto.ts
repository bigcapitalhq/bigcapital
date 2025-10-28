import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class ItemReceiptsResponseDto {
  @ApiProperty({
    example: 123,
    description: 'The unique identifier of the receipt.',
  })
  receiptId: number;

  @ApiProperty({ example: 'RCPT-2024-001', description: 'The receipt number.' })
  receipNumber: string;

  @ApiProperty({
    example: 'REF-2024-001',
    description: 'The reference number for the receipt.',
  })
  referenceNumber: string;

  @ApiProperty({
    example: '2024-06-01',
    description: 'The date of the receipt.',
  })
  receiptDate: string;

  @ApiProperty({
    example: '01/06/2024',
    description: 'The formatted date of the receipt.',
  })
  formattedReceiptDate: string;

  @ApiProperty({ example: 1000, description: 'The amount for the receipt.' })
  amount: number;

  @ApiProperty({
    example: '$1,000.00',
    description: 'The formatted amount for the receipt.',
  })
  formattedAmount: string;

  @ApiProperty({
    example: 10,
    description: 'The quantity of items in the receipt.',
  })
  quantity: number;

  @ApiProperty({
    example: '10',
    description: 'The formatted quantity of items in the receipt.',
  })
  formattedQuantity: string;

  @ApiProperty({
    example: 100,
    description: 'The rate per item in the receipt.',
  })
  rate: number;

  @ApiProperty({
    example: '$100.00',
    description: 'The formatted rate per item in the receipt.',
  })
  formattedRate: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The display name of the customer.',
  })
  customerDisplayName: string;

  @ApiProperty({
    example: 'USD',
    description: 'The currency code of the customer.',
  })
  customerCurrencyCode: string;
}
