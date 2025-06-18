import { ApiProperty } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class ItemEstimatesResponseDto {
  @ApiProperty({
    example: 123,
    description: 'The unique identifier of the estimate.',
  })
  estimateId: number;

  @ApiProperty({ example: 'EST-2024-001', description: 'The estimate number.' })
  estimateNumber: string;

  @ApiProperty({
    example: 'REF-2024-001',
    description: 'The reference number for the estimate.',
  })
  referenceNumber: string;

  @ApiProperty({
    example: '2024-06-01',
    description: 'The date of the estimate.',
  })
  estimateDate: string;

  @ApiProperty({
    example: '01/06/2024',
    description: 'The formatted estimate date.',
  })
  formattedEstimateDate: string;

  @ApiProperty({ example: 1000, description: 'The amount of the estimate.' })
  amount: number;

  @ApiProperty({
    example: '$1,000.00',
    description: 'The formatted amount of the estimate.',
  })
  formattedAmount: string;

  @ApiProperty({ example: 5, description: 'The quantity in the estimate.' })
  quantity: number;

  @ApiProperty({
    example: '5',
    description: 'The formatted quantity in the estimate.',
  })
  formattedQuantity: string;

  @ApiProperty({ example: 200, description: 'The rate in the estimate.' })
  rate: number;

  @ApiProperty({
    example: '$200.00',
    description: 'The formatted rate in the estimate.',
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
