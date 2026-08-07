import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ItemLinkDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Consulting service',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
