import { createDeepEqualSelector } from 'utils';
import { paginationLocationQuery } from 'store/selectors';

const estimatesTableState = (state) => state.salesEstimates.tableState;
 
// Retrieve estimates table query.
export const getEstimatesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    estimatesTableState,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
