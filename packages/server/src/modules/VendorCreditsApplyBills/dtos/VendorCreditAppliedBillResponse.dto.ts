import { ApiProperty } from '@nestjs/swagger';

export class VendorCreditAppliedBillResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the applied bill record',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The amount of the vendor credit applied to the bill',
    example: 500,
  })
  amount: number;

  @ApiProperty({
    description: 'The ID of the bill the vendor credit was applied to',
    example: 1001,
  })
  billId: number;

  @ApiProperty({
    description: 'The ID of the vendor credit',
    example: 2001,
  })
  vendorCreditId: number;

  // Computed fields from the nested bill / vendorCredit graph.
  @ApiProperty({
    description: 'The vendor credit number',
    example: 'VC-2024-001',
    required: false,
  })
  vendorCreditNumber?: string;

  @ApiProperty({
    description: 'The vendor credit date',
    example: '2024-03-15T00:00:00Z',
    required: false,
  })
  vendorCreditDate?: Date;

  @ApiProperty({
    description: 'Formatted vendor credit date',
    example: '2024-03-15',
    required: false,
  })
  formattedVendorCreditDate?: string;

  @ApiProperty({
    description: 'The bill number',
    example: 'BILL-2024-001',
    required: false,
  })
  billNumber?: string;

  @ApiProperty({
    description: 'The bill reference number',
    example: 'PO-2024-001',
    required: false,
  })
  billReferenceNo?: string;

  @ApiProperty({
    description: 'Formatted bill date',
    example: '2024-03-10',
    required: false,
  })
  formattedBillDate?: string;

  @ApiProperty({
    description: 'Formatted applied amount',
    example: '$500.00',
    required: false,
  })
  formattedAmount?: string;

  // Timestamps
  @ApiProperty({
    description: 'The date when the applied bill record was created',
    example: '2024-03-15T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the applied bill record was last updated',
    example: '2024-03-16T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;
}
