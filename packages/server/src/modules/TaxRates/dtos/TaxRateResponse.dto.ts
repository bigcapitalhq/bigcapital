import { ApiProperty } from '@nestjs/swagger';

export class TaxRateResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the tax rate',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the tax rate',
    example: 'VAT',
  })
  name: string;

  @ApiProperty({
    description:
      'The formatted name of the tax rate including the rate percentage',
    example: 'VAT [10%]',
  })
  nameFormatted: string;

  @ApiProperty({
    description: 'The code of the tax rate',
    example: 'VAT',
  })
  code: string;

  @ApiProperty({
    description: 'The rate of the tax rate as a decimal number',
    example: 10,
  })
  rate: number;

  @ApiProperty({
    description: 'The formatted rate of the tax rate with percentage symbol',
    example: '10%',
  })
  rateFormatted: string;

  @ApiProperty({
    description: 'The description of the tax rate',
    example: 'Value Added Tax',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the tax is non-recoverable',
    example: false,
  })
  isNonRecoverable: boolean;

  @ApiProperty({
    description: 'Whether the tax is compound',
    example: false,
  })
  isCompound: boolean;

  @ApiProperty({
    description: 'Whether the tax rate is active',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'The date when the tax rate was created',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the tax rate was last updated',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: Date;
}
