import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AccountResponseDto } from '@/modules/Accounts/dtos/AccountResponse.dto';

export class RefundVendorCreditResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the refund transaction',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The ID of the vendor credit being refunded',
    example: 1001,
  })
  vendorCreditId: number;

  @ApiProperty({
    description: 'The refund amount',
    example: 500,
  })
  amount: number;

  @ApiProperty({
    description: 'The currency code',
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    description: 'The exchange rate for currency conversion',
    example: 1.0,
  })
  exchangeRate: number;

  @ApiProperty({
    description: 'The reference number',
    example: 'REF-2024-001',
  })
  referenceNo: string;

  @ApiProperty({
    description: 'The deposit account ID',
    example: 10,
  })
  depositAccountId: number;

  @ApiProperty({
    description: 'A description of the refund',
    example: 'Refund for overpayment',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The ID of the branch',
    example: 1,
    required: false,
  })
  branchId?: number;

  @ApiProperty({
    description: 'The date of the refund',
    example: '2024-03-15T00:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'The deposit account the refund was paid into',
    type: () => AccountResponseDto,
    required: false,
  })
  @Type(() => AccountResponseDto)
  depositAccount?: AccountResponseDto;

  // Formatted fields
  @ApiProperty({
    description: 'Formatted refund amount',
    example: '$500.00',
    required: false,
  })
  formattedAmount?: string;

  @ApiProperty({
    description: 'Formatted refund date',
    example: '2024-03-15',
    required: false,
  })
  formattedDate?: string;

  // Timestamps
  @ApiProperty({
    description: 'The date when the refund was created',
    example: '2024-03-15T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the refund was last updated',
    example: '2024-03-16T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;
}
