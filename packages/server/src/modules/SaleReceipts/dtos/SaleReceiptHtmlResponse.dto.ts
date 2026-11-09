import { ApiProperty } from '@nestjs/swagger';

export class SaleReceiptHtmlContentResponseDto {
  @ApiProperty({
    description: 'The HTML content of the sale receipt',
    example: '<html>...</html>',
  })
  htmlContent: string;
}
