import * as momentTz from 'moment-timezone';
import {
  IsHexColor,
  IsIn,
  IsISO31661Alpha2,
  IsISO4217CurrencyCode,
  IsOptional,
  IsString,
} from 'class-validator';
import { MONTHS } from '../Organization/constants';
import { ACCEPTED_LOCALES, DATE_FORMATS } from '../Organization.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BuildOrganizationDto {
  @IsString()
  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Inc.',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Industry of the organization',
    example: 'Technology',
  })
  industry?: string;

  @IsISO31661Alpha2()
  @ApiProperty({
    description: 'Country location in ISO 3166-1 alpha-2 format',
    example: 'US',
  })
  location: string;

  @IsISO4217CurrencyCode()
  @ApiProperty({
    description: 'Base currency in ISO 4217 format',
    example: 'USD',
  })
  baseCurrency: string;

  @IsIn(momentTz.tz.names())
  @ApiProperty({
    description: 'Timezone of the organization',
    example: 'America/New_York',
  })
  timezone: string;

  @IsIn(MONTHS)
  @ApiProperty({
    description: 'Starting month of fiscal year',
    example: 'January',
  })
  fiscalYear: string;

  @IsIn(ACCEPTED_LOCALES)
  @ApiProperty({
    description: 'Language/locale of the organization',
    example: 'en-US',
  })
  language: string;

  @IsOptional()
  @IsIn(DATE_FORMATS)
  @ApiPropertyOptional({
    description: 'Date format used by the organization',
    example: 'MM/DD/YYYY',
  })
  dateFormat?: string;
}

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Organization name',
    example: 'Acme Inc.',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Industry of the organization',
    example: 'Technology',
  })
  industry?: string;

  @IsOptional()
  @IsISO31661Alpha2()
  @ApiPropertyOptional({
    description: 'Country location in ISO 3166-1 alpha-2 format',
    example: 'US',
  })
  location?: string;

  @IsOptional()
  @IsISO4217CurrencyCode()
  @ApiPropertyOptional({
    description: 'Base currency in ISO 4217 format',
    example: 'USD',
  })
  baseCurrency?: string;

  @IsOptional()
  @IsIn(momentTz.tz.names())
  @ApiPropertyOptional({
    description: 'Timezone of the organization',
    example: 'America/New_York',
  })
  timezone?: string;

  @IsOptional()
  @IsIn(MONTHS)
  @ApiPropertyOptional({
    description: 'Starting month of fiscal year',
    example: 'January',
  })
  fiscalYear?: string;

  @IsOptional()
  @IsIn(ACCEPTED_LOCALES)
  @ApiPropertyOptional({
    description: 'Language/locale of the organization',
    example: 'en-US',
  })
  language?: string;

  @IsOptional()
  @IsIn(DATE_FORMATS)
  @ApiPropertyOptional({
    description: 'Date format used by the organization',
    example: 'MM/DD/YYYY',
  })
  dateFormat?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Organization address details',
    example: {
      address_1: '123 Main St',
      address_2: 'Suite 100',
      postal_code: '10001',
      city: 'New York',
      stateProvince: 'NY',
      phone: '+1-555-123-4567',
    },
  })
  address?: {
    address_1?: string;
    address_2?: string;
    postal_code?: string;
    city?: string;
    stateProvince?: string;
    phone?: string;
  };

  @IsOptional()
  @IsHexColor()
  @ApiPropertyOptional({
    description: 'Primary brand color in hex format',
    example: '#4285F4',
  })
  primaryColor?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Logo file key reference',
    example: 'organizations/acme-logo-123456.png',
  })
  logoKey?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Organization tax identification number',
    example: '12-3456789',
  })
  taxNumber?: string;
}
