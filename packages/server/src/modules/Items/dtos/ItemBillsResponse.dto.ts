import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class ItemBillsResponseDto {
  @ApiProperty({
    example: 123,
    description: 'The unique identifier of the bill.',
  })
  billId: number;

  @ApiProperty({
    example: 'BILL-2024-001',
    description: 'The bill number.',
  })
  billNumber: string;

  @ApiProperty({
    example: 'REF-2024-001',
    description: 'The reference number of the bill.',
  })
  referenceNumber: string;

  @ApiProperty({
    example: '2024-06-01',
    description: 'The date of the bill.',
  })
  billDate: string;

  @ApiProperty({
    example: '01/06/2024',
    description: 'The formatted date of the bill.',
  })
  formattedBillDate: string;

  @ApiProperty({
    example: '2024-06-15',
    description: 'The due date of the bill.',
  })
  billDueDate: string;

  @ApiProperty({
    example: '15/06/2024',
    description: 'The formatted due date of the bill.',
  })
  formattedBillDueDate: string;

  @ApiProperty({
    example: 1000,
    description: 'The amount of the bill item.',
  })
  amount: number;

  @ApiProperty({
    example: '$1,000.00',
    description: 'The formatted amount of the bill item.',
  })
  formattedAmount: string;

  @ApiProperty({
    example: 5,
    description: 'The quantity of the item in the bill.',
  })
  quantity: number;

  @ApiProperty({
    example: '5',
    description: 'The formatted quantity of the item in the bill.',
  })
  formattedQuantity: string;

  @ApiProperty({
    example: 200,
    description: 'The rate of the item in the bill.',
  })
  rate: number;

  @ApiProperty({
    example: '$200.00',
    description: 'The formatted rate of the item in the bill.',
  })
  formattedRate: string;

  @ApiProperty({
    example: 'Acme Vendor',
    description: 'The display name of the vendor.',
  })
  vendorDisplayName: string;

  @ApiProperty({
    example: 'USD',
    description: 'The currency code of the vendor.',
  })
  vendorCurrencyCode: string;
}
