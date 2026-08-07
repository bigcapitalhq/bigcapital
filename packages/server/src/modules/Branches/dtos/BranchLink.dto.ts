import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BranchLinkDto {
  @ApiProperty({
    description: 'The name of the branch',
    example: 'Main Office',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
