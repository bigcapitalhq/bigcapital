import { ApiProperty } from '@nestjs/swagger';

export class CurrencyResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the currency',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the currency',
    example: 'US Dollar',
  })
  currencyName: string;

  @ApiProperty({
    description: 'The code of the currency',
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    description: 'The sign/symbol of the currency',
    example: '$',
  })
  currencySign: string;

  @ApiProperty({
    description: 'Whether this is the base currency for the organization',
    example: true,
  })
  isBaseCurrency: boolean;

  @ApiProperty({
    description: 'The creation timestamp',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update timestamp',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: Date;
}
