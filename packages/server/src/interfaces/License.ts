

export interface ILicense {
  id?: number,
  licenseCode: string,
  licensePeriod: number,
  sent: boolean,
  disabled: boolean,
  used: boolean,
};

export interface ILicensesFilter {
  active: boolean,
  disabld: boolean,
  used: boolean,
  sent: boolean,
};

export interface ISendLicenseDTO {
  phoneNumber: string,
  email: string,
  period: string,
  periodInterval: string,
  planSlug: string,
};