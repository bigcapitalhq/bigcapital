import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VendorLinkDto {
  @ApiProperty({
    description: 'The display name of the vendor',
    example: 'Acme Supplies Ltd.',
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;
}
