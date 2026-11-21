import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBankReconciliationsQueryDto {
  @ApiProperty({
    description: 'Bank account ID',
    required: true,
    type: Number,
    example: 1000,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  accountId: number;
}
