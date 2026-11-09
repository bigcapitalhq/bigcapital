import { ApiProperty } from '@nestjs/swagger';

export class SaleEstimateHtmlContentResponseDto {
  @ApiProperty({
    description: 'The HTML content of the estimate',
    example: '<html>...</html>',
  })
  htmlContent: string;
}
