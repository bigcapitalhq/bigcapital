import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactAddressDto {
  @ApiProperty({ required: false, description: 'Billing address line 1' })
  @IsOptional()
  @IsString()
  billingAddress1?: string;

  @ApiProperty({ required: false, description: 'Billing address line 2' })
  @IsOptional()
  @IsString()
  billingAddress2?: string;

  @ApiProperty({ required: false, description: 'Billing address city' })
  @IsOptional()
  @IsString()
  billingAddressCity?: string;

  @ApiProperty({ required: false, description: 'Billing address country' })
  @IsOptional()
  @IsString()
  billingAddressCountry?: string;

  @ApiProperty({ required: false, description: 'Billing address email' })
  @IsOptional()
  @IsEmail()
  billingAddressEmail?: string;

  @ApiProperty({ required: false, description: 'Billing address zipcode' })
  @IsOptional()
  @IsString()
  billingAddressZipcode?: string;

  @ApiProperty({ required: false, description: 'Billing address phone' })
  @IsOptional()
  @IsString()
  billingAddressPhone?: string;

  @ApiProperty({ required: false, description: 'Billing address state' })
  @IsOptional()
  @IsString()
  billingAddressState?: string;

  @ApiProperty({ required: false, description: 'Shipping address line 1' })
  @IsOptional()
  @IsString()
  shippingAddress1?: string;

  @ApiProperty({ required: false, description: 'Shipping address line 2' })
  @IsOptional()
  @IsString()
  shippingAddress2?: string;

  @ApiProperty({ required: false, description: 'Shipping address city' })
  @IsOptional()
  @IsString()
  shippingAddressCity?: string;

  @ApiProperty({ required: false, description: 'Shipping address country' })
  @IsOptional()
  @IsString()
  shippingAddressCountry?: string;

  @ApiProperty({ required: false, description: 'Shipping address email' })
  @IsOptional()
  @IsEmail()
  shippingAddressEmail?: string;

  @ApiProperty({ required: false, description: 'Shipping address zipcode' })
  @IsOptional()
  @IsString()
  shippingAddressZipcode?: string;

  @ApiProperty({ required: false, description: 'Shipping address phone' })
  @IsOptional()
  @IsString()
  shippingAddressPhone?: string;

  @ApiProperty({ required: false, description: 'Shipping address state' })
  @IsOptional()
  @IsString()
  shippingAddressState?: string;
}
