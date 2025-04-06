import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactAddressDto } from './ContactAddress.dto';

export class CreateCustomerDto extends ContactAddressDto {
  @ApiProperty({ required: true, description: 'Customer type' })
  @IsString()
  @IsNotEmpty()
  customerType: string;

  @ApiProperty({ required: true, description: 'Currency code' })
  @IsString()
  @IsNotEmpty()
  currencyCode: string;

  @ApiProperty({ required: false, description: 'Opening balance' })
  @IsOptional()
  @IsNumber()
  openingBalance?: number;

  @ApiProperty({ required: false, description: 'Opening balance date' })
  @IsOptional()
  @IsString()
  openingBalanceAt?: string;

  @ApiProperty({
    required: false,
    description: 'Opening balance exchange rate',
  })
  @IsOptional()
  @IsNumber()
  openingBalanceExchangeRate?: number;

  @ApiProperty({ required: false, description: 'Opening balance branch ID' })
  @IsOptional()
  @IsNumber()
  openingBalanceBranchId?: number;

  @ApiProperty({ required: false, description: 'Salutation' })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiProperty({ required: false, description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, description: 'Company name' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: true, description: 'Display name' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ required: false, description: 'Website' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false, description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, description: 'Work phone' })
  @IsOptional()
  @IsString()
  workPhone?: string;

  @ApiProperty({ required: false, description: 'Personal phone' })
  @IsOptional()
  @IsString()
  personalPhone?: string;

  @ApiProperty({ required: false, description: 'Note' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false, description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
