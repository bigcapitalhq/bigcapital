


export interface IOrganizationSetupDTO{
  organizationName: string,
  baseCurrency: string,
  fiscalYear: string,
  industry: string,
  timeZone: string,
}

export interface IOrganizationBuildDTO {
  name: string;
  baseCurrency: string,
  timezone: string;
  fiscalYear: string;
  industry: string;
}

export interface IOrganizationUpdateDTO {
  name: string;
  baseCurrency: string,
  timezone: string;
  fiscalYear: string;
  industry: string;
}