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

export interface IOrganizationUpdateDTO {
  name: string;
  location: string;
  baseCurrency: string;
  timezone: string;
  fiscalYear: string;
  industry: string;
  taxNumber: string;
}

export interface IOrganizationBuildEventPayload {
  tenantId: number;
  buildDTO: IOrganizationBuildDTO;
  systemUser: ISystemUser;
}
