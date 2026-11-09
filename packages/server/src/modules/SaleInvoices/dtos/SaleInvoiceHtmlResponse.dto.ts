import { ApiProperty } from '@nestjs/swagger';

export class SaleInvoiceHtmlContentResponseDto {
  @ApiProperty({
    description: 'The HTML content of the sale invoice',
    example: '<html>...</html>',
  })
  htmlContent: string;
}
