import { ApiProperty } from '@nestjs/swagger';

export class PaymentReceivedHtmlContentResponseDto {
  @ApiProperty({
    description: 'The HTML content of the payment received',
    example: '<html>...</html>',
  })
  htmlContent: string;
}
