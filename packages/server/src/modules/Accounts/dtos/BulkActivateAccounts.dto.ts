import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkActivateAccountsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Array of account IDs to activate or inactivate',
    type: [Number],
    example: [1, 2, 3],
  })
  ids: number[];
}
