import moment from 'moment';

/**
 * Retrieves the default cashflow sheet query.
 */
export const getDefaultCashFlowSheetQuery = () => {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    displayColumnsType: 'total',
    filterByOption: 'with-transactions',
    branchesIds: [],
  };
};
