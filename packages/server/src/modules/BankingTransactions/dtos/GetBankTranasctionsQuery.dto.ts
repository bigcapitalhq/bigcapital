import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { NumberFormatQueryDto } from './NumberFormatQuery.dto';
import { Type } from 'class-transformer';

export class GetBankTransactionsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  accountId: number;

  @IsOptional()
  numberFormat: NumberFormatQueryDto;
}
