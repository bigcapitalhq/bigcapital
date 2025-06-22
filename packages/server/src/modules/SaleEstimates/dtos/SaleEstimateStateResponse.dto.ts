import { ApiProperty } from '@nestjs/swagger';

export class SaleEstiamteStateResponseDto {
  @ApiProperty({
    description: 'The ID of the default PDF template for sale estimates',
    example: 1,
    type: Number,
    nullable: true,
  })
  defaultTemplateId: number;
}
