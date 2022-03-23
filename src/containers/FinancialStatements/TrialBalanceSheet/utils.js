import moment from 'moment';

export function getDefaultTrialBalanceQuery() {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    filterByOption: 'with-transactions',
    branchesIds: [],
  };
}
