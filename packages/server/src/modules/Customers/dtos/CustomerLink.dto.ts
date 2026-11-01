import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerLinkDto {
  @ApiProperty({
    description: 'The display name of the customer',
    example: 'Acme Inc.',
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;
}
