import * as moment from 'moment';

export const getTrialBalanceSheetDefaultQuery = () => ({
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  numberFormat: {
    divideOn1000: false,
    negativeFormat: 'mines',
    showZero: false,
    formatMoney: 'total',
    precision: 2,
  },
  basis: 'accrual',
  noneZero: false,
  noneTransactions: true,
  onlyActive: false,
  accountIds: [],
});
