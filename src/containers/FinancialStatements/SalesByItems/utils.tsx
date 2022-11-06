// @ts-nocheck
import moment from 'moment';

export const getDefaultSalesByItemsQuery = () => {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    filterByOption: 'with-transactions',
  };
};
