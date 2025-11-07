import { IsOptional, ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(255) // Assuming DATATYPES_LENGTH.STRING is 255
  @ApiProperty({
    description: 'Account name',
    example: 'Cash Account',
    minLength: 3,
    maxLength: 255,
  })
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(6)
  @ApiProperty({
    description: 'Account code',
    example: 'CA001',
    required: false,
    minLength: 3,
    maxLength: 6,
  })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Currency code for the account',
    example: 'USD',
    required: false,
  })
  currencyCode?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty({
    description: 'Type of account',
    example: 'asset',
    minLength: 3,
    maxLength: 255,
  })
  accountType: string;

  @IsOptional()
  @IsString()
  @MaxLength(65535)
  @ApiProperty({
    description: 'Account description',
    example: 'Main cash account for daily operations',
    required: false,
    maxLength: 65535,
  })
  description?: string;

  @IsOptional()
  @ToNumber()
  @ApiProperty({
    description: 'ID of the parent account',
    example: 1,
    required: false,
  })
  parentAccountId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the account is active',
    example: true,
    required: false,
    default: true,
  })
  active?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Plaid account ID for syncing',
    example: 'plaid_account_123456',
    required: false,
  })
  plaidAccountId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Plaid item ID for syncing',
    example: 'plaid_item_123456',
    required: false,
  })
  plaidItemId?: string;
}
