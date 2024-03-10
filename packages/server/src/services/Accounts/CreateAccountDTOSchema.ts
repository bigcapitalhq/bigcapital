import { DATATYPES_LENGTH } from '@/data/DataTypes';
import { IsInt, IsOptional, IsString, Length, Min, Max } from 'class-validator';

export class AccountDTOSchema {
  @IsString()
  @Length(3, DATATYPES_LENGTH.STRING)
  name: string;

  // @IsString()
  // @IsInt()
  @IsOptional()
  // @Length(3, 6)
  code?: string;

  @IsOptional()
  currencyCode?: string;

  @IsString()
  @Length(3, DATATYPES_LENGTH.STRING)
  accountType: string;

  @IsString()
  @IsOptional()
  @Length(0, DATATYPES_LENGTH.TEXT)
  description?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(DATATYPES_LENGTH.INT_10)
  parentAccountId?: number;
}
