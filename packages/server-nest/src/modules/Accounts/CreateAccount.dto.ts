import {
  IsString,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(255) // Assuming DATATYPES_LENGTH.STRING is 255
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(6)
  code?: string;

  @IsOptional()
  @IsString()
  currencyCode?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  accountType: string;

  @IsOptional()
  @IsString()
  @MaxLength(65535)
  description?: string;

  @IsOptional()
  @IsInt()
  parentAccountId?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  plaidAccountId?: string;

  @IsOptional()
  @IsString()
  plaidItemId?: string;
}
