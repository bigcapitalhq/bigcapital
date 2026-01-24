import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
  IsBoolean,
  IsEmail,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ContactAddressDto } from '@/modules/Customers/dtos/ContactAddress.dto';
import { IsOptional, ToNumber } from '@/common/decorators/Validators';

export class CreateVendorDto extends ContactAddressDto {
  @ApiProperty({ required: false, description: 'Vendor opening balance' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @ToNumber()
  openingBalance?: number;

  @ApiProperty({
    required: false,
    description: 'Vendor opening balance exchange rate',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @ToNumber()
  openingBalanceExchangeRate?: number;

  @ApiProperty({
    required: false,
    description: 'Date of the opening balance (required when openingBalance is provided)',
  })
  @ValidateIf((o) => o.openingBalance != null)
  @IsNotEmpty({ message: 'openingBalanceAt is required when openingBalance is provided' })
  @IsISO8601()
  openingBalanceAt?: Date;

  @ApiProperty({
    required: false,
    description: 'Branch ID for the opening balance',
  })
  @IsOptional()
  @IsInt()
  @ToNumber()
  openingBalanceBranchId?: number;

  @ApiProperty({ description: 'Currency code for the vendor' })
  @IsOptional()
  @IsString()
  currencyCode: string;

  @ApiProperty({ required: false, description: 'Vendor salutation' })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiProperty({ required: false, description: 'Vendor first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Vendor last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, description: 'Vendor company name' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false, description: 'Vendor display name' })
  @IsString()
  displayName: string;

  @ApiProperty({ required: false, description: 'Vendor website' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false, description: 'Vendor email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, description: 'Vendor work phone number' })
  @IsOptional()
  @IsString()
  workPhone?: string;

  @ApiProperty({ required: false, description: 'Vendor personal phone number' })
  @IsOptional()
  @IsString()
  personalPhone?: string;

  @ApiProperty({
    required: false,
    description: 'Additional notes about the vendor',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    required: false,
    description: 'Whether the vendor is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
