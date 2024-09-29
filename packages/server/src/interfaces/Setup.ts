import { ISystemUser } from '@/interfaces';

export interface IOrganizationSetupDTO {
  organizationName: string;
  baseCurrency: string;
  fiscalYear: string;
  industry: string;
  timeZone: string;
}

export interface IOrganizationBuildDTO {
  name: string;
  industry: string;
  location: string;
  baseCurrency: string;
  timezone: string;
  fiscalYear: string;
  dateFormat?: string;
}

interface OrganizationAddressDTO {
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
  stateProvince: string;
  phone: string;
}

export interface IOrganizationUpdateDTO {
  name: string;
  location?: string;
  baseCurrency?: string;
  timezone?: string;
  fiscalYear?: string;
  industry?: string;
  taxNumber?: string;
  primaryColor?: string;
  logoKey?: string;
  address?: OrganizationAddressDTO;
}

export interface IOrganizationBuildEventPayload {
  tenantId: number;
  buildDTO: IOrganizationBuildDTO;
  systemUser: ISystemUser;
}

export interface IOrganizationBuiltEventPayload {
  tenantId: number;
}
