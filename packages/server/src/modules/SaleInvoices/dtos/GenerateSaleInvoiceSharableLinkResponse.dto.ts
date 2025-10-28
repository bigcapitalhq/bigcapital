import { ApiProperty } from '@nestjs/swagger';

export class GenerateSaleInvoiceSharableLinkResponseDto {
  @ApiProperty({
    description: 'Sharable payment link for the sale invoice',
    example:
      'http://localhost:3000/payment/123e4567-e89b-12d3-a456-426614174000',
  })
  link: string;
}
