import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import type { RootState } from '@/store/reducers';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
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

export function withVendorActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithVendorActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithVendorActionsProps>
  >;
}
