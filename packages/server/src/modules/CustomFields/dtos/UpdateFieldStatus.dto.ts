import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateFieldStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: 'New active status.', example: true })
  active: boolean;
}
