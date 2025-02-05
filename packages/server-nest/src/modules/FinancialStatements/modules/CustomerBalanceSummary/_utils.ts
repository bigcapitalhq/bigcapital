import * as moment from 'moment';

export const getCustomerBalanceSummaryDefaultQuery = () => ({
  asDate: moment().format('YYYY-MM-DD'),
  numberFormat: {
    precision: 2,
    divideOn1000: false,
    showZero: false,
    formatMoney: 'total',
    negativeFormat: 'mines',
  },
  percentageColumn: false,

  noneZero: false,
  noneTransactions: true,
});
