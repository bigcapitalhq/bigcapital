import { ApiProperty } from '@nestjs/swagger';

export class BillLandedCostTransactionDto {
  @ApiProperty({
    description: 'The unique identifier of the landed cost transaction',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The bill id the landed cost is allocated to',
    example: 10,
    required: false,
  })
  billId?: number;

  @ApiProperty({
    description: 'The id of the source transaction the cost was allocated from',
    example: 5,
    required: false,
  })
  fromTransactionId?: number;

  @ApiProperty({
    description: 'The type of the source transaction (Bill or Expense)',
    example: 'Expense',
    required: false,
  })
  fromTransactionType?: string;

  @ApiProperty({
    description: 'The entry id of the source transaction',
    example: 2,
    required: false,
  })
  fromTransactionEntryId?: number;

  @ApiProperty({
    description: 'The allocation method used to distribute the cost',
    example: 'quantity',
    required: false,
  })
  allocationMethod?: string;

  @ApiProperty({
    description: 'The translated label of the allocation method',
    example: 'Quantity',
    required: false,
  })
  allocationMethodFormatted?: string;

  @ApiProperty({
    description: 'The cost account id the landed cost is posted to',
    example: 1020,
    required: false,
  })
  costAccountId?: number;

  @ApiProperty({
    description: 'The description of the landed cost transaction',
    example: 'Freight charges',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The allocated landed cost amount',
    example: 150,
    required: false,
  })
  amount?: number;

  @ApiProperty({
    description: 'The allocated landed cost amount in the base currency',
    example: 150,
    required: false,
  })
  localAmount?: number;

  @ApiProperty({
    description: 'The currency code of the landed cost transaction',
    example: 'USD',
    required: false,
  })
  currencyCode?: string;

  @ApiProperty({
    description: 'The exchange rate applied to the amount',
    example: 1,
    required: false,
  })
  exchangeRate?: number;

  @ApiProperty({
    description: 'The resolved name of the source item or expense account',
    example: 'Widget A',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Formatted allocated amount',
    example: '$150.00',
    required: false,
  })
  formattedAmount?: string;

  @ApiProperty({
    description: 'Formatted allocated amount in the base currency',
    example: '$150.00',
    required: false,
  })
  formattedLocalAmount?: string;
}
