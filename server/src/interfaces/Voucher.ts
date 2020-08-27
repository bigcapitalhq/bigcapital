

export interface IVoucher {
  id?: number,
  voucherCode: string,
  voucherPeriod: number,
  sent: boolean,
  disabled: boolean,
  used: boolean,
};

export interface IVouchersFilter {
  active: boolean,
  disabld: boolean,
  used: boolean,
  sent: boolean,
};