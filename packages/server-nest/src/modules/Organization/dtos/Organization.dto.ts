import moment from 'moment';
import {IsHexColor, 
  IsIn,
  IsISO31661Alpha2,
  IsISO4217CurrencyCode,
  IsOptional,
  IsString,
} from 'class-validator';
import { MONTHS } from '../Organization/constants';
import { ACCEPTED_LOCALES, DATE_FORMATS } from '../Organization.constants';

export class BuildOrganizationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsISO31661Alpha2()
  location: string;

  @IsISO4217CurrencyCode()
  baseCurrency: string;

  @IsIn(moment.tz.names())
  timezone: string;

  @IsIn(MONTHS)
  fiscalYear: string;

  @IsIn(ACCEPTED_LOCALES)
  language: string;

  @IsOptional()
  @IsIn(DATE_FORMATS)
  dateFormat?: string;
}

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsISO31661Alpha2()
  location?: string;

  @IsOptional()
  @IsISO4217CurrencyCode()
  baseCurrency?: string;

  @IsOptional()
  @IsIn(moment.tz.names())
  timezone?: string;

  @IsOptional()
  @IsIn(MONTHS)
  fiscalYear?: string;

  @IsOptional()
  @IsIn(ACCEPTED_LOCALES)
  language?: string;

  @IsOptional()
  @IsIn(DATE_FORMATS)
  dateFormat?: string;

  @IsOptional()
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
  primaryColor?: string;

  @IsOptional()
  @IsString()
  logoKey?: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;
}
