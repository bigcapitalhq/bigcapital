

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