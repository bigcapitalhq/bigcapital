import moment from 'moment';

/**
 * Retrieves the default journal report query.
 */
export const getDefaultJournalQuery = () => {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    branchesIds: [],
  };
};
