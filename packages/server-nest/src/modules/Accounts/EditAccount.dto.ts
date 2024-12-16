import {
  IsString,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export class EditAccountDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(255) // Assuming DATATYPES_LENGTH.STRING is 255
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(6)
  code?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255) // Assuming DATATYPES_LENGTH.STRING is 255
  accountType: string;

  @IsOptional()
  @IsString()
  @MaxLength(65535) // Assuming DATATYPES_LENGTH.TEXT is 65535
  description?: string;

  @IsOptional()
  @IsInt()
  parentAccountId?: number;
}
