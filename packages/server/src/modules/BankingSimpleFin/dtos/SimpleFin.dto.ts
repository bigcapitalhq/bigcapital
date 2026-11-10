import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SIMPLEFIN_LINKABLE_ACCOUNT_TYPES } from '../constants';

export class SimpleFinClaimTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'aHR0cHM6Ly9iZXRhLWJyaWRnZS5zaW1wbGVmaW4ub3JnL3NpbXBsZWZpbi9jbGFpbS9ERU1P',
    description:
      'The SimpleFIN setup token (base64 encoded claim URL) created in SimpleFIN Bridge.',
  })
  setupToken: string;
}

export class SimpleFinLinkAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ACT-1a2b3c',
    description: 'The SimpleFIN account id to link.',
  })
  accountId: string;

  @IsString()
  @IsIn([...SIMPLEFIN_LINKABLE_ACCOUNT_TYPES])
  @ApiProperty({
    example: 'bank',
    enum: [...SIMPLEFIN_LINKABLE_ACCOUNT_TYPES],
    description: 'The system account type to create for the SimpleFIN account.',
  })
  accountType: string;
}

export class SimpleFinLinkAccountsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'f0a5c1b2-7a6d-4f9e-9c1a-2b3c4d5e6f70',
    description:
      'The SimpleFIN item id returned when claiming the setup token.',
  })
  itemId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SimpleFinLinkAccountDto)
  @ApiProperty({
    type: [SimpleFinLinkAccountDto],
    description: 'The SimpleFIN accounts to link as bank/credit card accounts.',
  })
  accounts: SimpleFinLinkAccountDto[];
}

export class SimpleFinClaimedAccountResponseDto {
  @ApiProperty({ example: 'ACT-1a2b3c', description: 'SimpleFIN account id.' })
  id: string;

  @ApiProperty({ example: 'Everyday Checking', description: 'Account name.' })
  name: string;

  @ApiProperty({ example: 'USD', description: 'Account currency.' })
  currency: string;

  @ApiProperty({ example: 1250.5, description: 'Current balance.' })
  balance: number;

  @ApiProperty({
    example: 1200.5,
    nullable: true,
    description: 'Available balance, when reported.',
  })
  availableBalance: number | null;

  @ApiProperty({
    example: '2026-11-04',
    nullable: true,
    description: 'The date the balance was reported.',
  })
  balanceDate: string | null;

  @ApiProperty({
    example: 'Example Bank',
    description: 'The institution/connection name.',
  })
  connectionName: string;
}

export class SimpleFinClaimTokenResponseDto {
  @ApiProperty({
    example: 'f0a5c1b2-7a6d-4f9e-9c1a-2b3c4d5e6f70',
    description: 'The SimpleFIN item id to use when linking accounts.',
  })
  itemId: string;

  @ApiProperty({ type: [SimpleFinClaimedAccountResponseDto] })
  accounts: SimpleFinClaimedAccountResponseDto[];
}

export class SimpleFinLinkAccountsResponseDto {
  @ApiProperty({
    example: [1001, 1002],
    description: 'The ids of the created bank/credit card accounts.',
  })
  accountIds: number[];
}
