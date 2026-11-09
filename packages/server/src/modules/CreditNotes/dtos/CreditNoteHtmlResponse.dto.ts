import { ApiProperty } from '@nestjs/swagger';

export class CreditNoteHtmlContentResponseDto {
  @ApiProperty({
    description: 'The HTML content of the credit note',
    example: '<html>...</html>',
  })
  htmlContent: string;
}
