import { ApiProperty } from '@nestjs/swagger';

export class PaymentReceivedStateResponseDto {
  @ApiProperty({
    description: 'The ID of the default PDF template for payment received',
    example: 1,
    type: Number,
    nullable: true,
  })
  defaultTemplateId: number;
}
