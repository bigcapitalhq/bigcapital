import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleAPAgingSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithAPAgingSummaryActionsProps {
  toggleAPAgingSummaryFilterDrawer: (toggle?: boolean) => void;
}

const mapActionsToProps = (
  dispatch: Dispatch,
): WithAPAgingSummaryActionsProps => ({
  toggleAPAgingSummaryFilterDrawer: (toggle) =>
    dispatch(toggleAPAgingSummaryFilterDrawer(toggle)),
});

export function withAPAgingSummaryActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithAPAgingSummaryActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithAPAgingSummaryActionsProps>
  >;
}
