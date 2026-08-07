import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import type { RootState } from '@/store/reducers';
import type { TableQuery } from '@/store/store.types';
import {
  setVendorCreditTableState,
  resetVendorCreditTableState,
} from '@/store/vendor-credit/vendor-credit.actions';

export interface WithVendorActionsProps {
  setVendorCreditsTableState: (queries: Partial<TableQuery>) => void;
  resetVendorCreditsTableState: () => void;
}

export const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
): WithVendorActionsProps => ({
  setVendorCreditsTableState: (queries) =>
    dispatch(setVendorCreditTableState(queries)),
  resetVendorCreditsTableState: () => dispatch(resetVendorCreditTableState()),
});

export const withVendorActions = connect(null, mapDispatchToProps);
