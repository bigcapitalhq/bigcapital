import { ContactAddressDto } from '@/modules/Customers/dtos/ContactAddress.dto';
import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditVendorDto extends ContactAddressDto {
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
  @IsOptional()
  @IsString()
  displayName?: string;

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

  @ApiProperty({ required: false, description: 'Additional notes about the vendor' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false, description: 'Whether the vendor is active' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
