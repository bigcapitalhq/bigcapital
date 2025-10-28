import * as moment from 'moment';

export const getAPAgingSummaryDefaultQuery = () => {
  return {
    asDate: moment().format('YYYY-MM-DD'),
    agingDaysBefore: 30,
    agingPeriods: 3,
    numberFormat: {
      precision: 2,
      divideOn1000: false,
      showZero: false,
      formatMoney: 'total',
      negativeFormat: 'mines',
    },
    vendorsIds: [],
    branchesIds: [],
    noneZero: false,
  };
};
