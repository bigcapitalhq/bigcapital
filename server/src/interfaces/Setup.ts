


export interface IOrganizationSetupDTO{
  organizationName: string,
  baseCurrency: string,
  fiscalYear: string,
  industry: string,
  timeZone: string,
}

export interface IOrganizationBuildDTO {
  organizationName: string;
  baseCurrency: string,
  timezone: string;
  fiscalYear: string;
  industry: string;
}

export interface IOrganizationUpdateDTO {
  organizationName: string;
  baseCurrency: string,
  timezone: string;
  fiscalYear: string;
  industry: string;
}