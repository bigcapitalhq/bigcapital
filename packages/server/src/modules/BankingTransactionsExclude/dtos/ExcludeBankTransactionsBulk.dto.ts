import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class ExcludeBankTransactionsBulkDto {
  @ApiProperty({
    description:
      'IDs of uncategorized bank transactions to exclude or unexclude',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  ids: number[];
}
