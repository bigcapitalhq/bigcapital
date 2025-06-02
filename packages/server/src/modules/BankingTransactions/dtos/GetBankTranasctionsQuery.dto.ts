import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { NumberFormatQueryDto } from './NumberFormatQuery.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetBankTransactionsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    type: Number,
    example: 1
  })
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    type: Number,
    example: 10
  })
  pageSize: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'Bank account ID',
    required: true,
    type: Number,
    example: 1
  })
  accountId: number;

  @IsOptional()
  @ApiProperty({
    description: 'Number format options',
    required: false,
    type: NumberFormatQueryDto
  })
  numberFormat: NumberFormatQueryDto;
}
