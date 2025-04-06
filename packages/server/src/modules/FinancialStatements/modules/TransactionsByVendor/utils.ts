
import * as moment from 'moment';

export const getTransactionsByVendorDefaultQuery = () => {
  return {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    numberFormat: {
      precision: 2,
      divideOn1000: false,
      showZero: false,
      formatMoney: 'total',
      negativeFormat: 'mines',
    },
    comparison: {
      percentageOfColumn: true,
    },
    noneZero: false,
    noneTransactions: true,
    vendorsIds: [],
  };
}