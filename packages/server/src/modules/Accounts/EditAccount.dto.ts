import { ApiProperty } from '@nestjs/swagger';
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
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the account',
    example: 'Bank Account',
  })
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(6)
  @ApiProperty({
    description: 'The code of the account',
    example: '123456',
  })
  code?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty({
    description: 'The type of the account',
    example: 'Bank Account',
  })
  accountType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The description of the account',
    example: 'This is a description',
  })
  description?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    description: 'The parent account ID of the account',
    example: 1,
  })
  parentAccountId?: number;
}
