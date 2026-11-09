import { ApiProperty } from '@nestjs/swagger';

export class RecurringInvoiceStateResponseDto {
  @ApiProperty({
    description: 'The ID of the default PDF template for sale invoices',
    example: 1,
    type: Number,
    nullable: true,
  })
  defaultTemplateId: number;
}
