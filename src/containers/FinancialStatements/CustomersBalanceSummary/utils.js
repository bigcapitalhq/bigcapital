import moment from 'moment';

export const getDefaultCustomersBalanceQuery = () => {
  return {
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    filterByOption: 'with-transactions',
  };
};
