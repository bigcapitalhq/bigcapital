import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ToNumber } from '@/common/decorators/Validators';

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
  @ToNumber()
  @ApiProperty({
    description: 'The parent account ID of the account',
    example: 1,
  })
  parentAccountId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Bank code. Three digits. Required for bank accounts when the organization is located in Brazil.',
    example: '341',
    required: false,
  })
  bankCode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Bank branch (agency) number, up to five digits. Required for bank accounts when the organization is located in Brazil.',
    example: '1234',
    required: false,
  })
  agencyNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Account number including its trailing check digit. Required for bank accounts when the organization is located in Brazil.',
    example: '12345678-9',
    required: false,
  })
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'CBU, 22 digits. Required for bank accounts when the organization is located in Argentina.',
    example: '2850590940090418135201',
    required: false,
  })
  cbu?: string;
}
