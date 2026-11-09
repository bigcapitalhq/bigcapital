import { ApiProperty } from '@nestjs/swagger';

export class SaleInvoiceTaxEntryDto {
  @ApiProperty({
    description: 'The unique identifier of the tax rate transaction',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the tax rate',
    example: 'VAT',
  })
  name: string;

  @ApiProperty({
    description: 'The code of the tax rate',
    example: 'VAT-15',
  })
  taxRateCode: string;

  @ApiProperty({
    description: 'The rate of the tax',
    example: 15,
  })
  taxRate: number;

  @ApiProperty({
    description: 'The id of the tax rate',
    example: 1,
  })
  taxRateId: number;

  @ApiProperty({
    description: 'The computed tax amount',
    example: 150,
  })
  taxRateAmount: number;

  @ApiProperty({
    description: 'The formatted tax rate amount',
    example: '$150.00',
  })
  taxRateAmountFormatted: string;
}
