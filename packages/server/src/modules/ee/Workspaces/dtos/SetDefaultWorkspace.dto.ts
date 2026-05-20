import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SetDefaultWorkspaceDto {
  @ApiProperty({ description: 'The organization ID to set as default' })
  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
