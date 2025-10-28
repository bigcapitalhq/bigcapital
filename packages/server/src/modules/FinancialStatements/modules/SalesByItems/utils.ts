import * as moment from 'moment';

export const getSalesByItemsDefaultQuery = () => {
  return {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    itemsIds: [],
    numberFormat: {
      precision: 2,
      divideOn1000: false,
      showZero: false,
      formatMoney: 'always',
      negativeFormat: 'mines',
    },
    noneTransactions: true,
    onlyActive: false,
  };
};
