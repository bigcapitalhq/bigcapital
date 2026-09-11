import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleARAgingSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithARAgingSummaryActionsProps {
  toggleARAgingSummaryFilterDrawer: (toggle?: boolean) => void;
}

const mapActionsToProps = (
  dispatch: Dispatch,
): WithARAgingSummaryActionsProps => ({
  toggleARAgingSummaryFilterDrawer: (toggle) =>
    dispatch(toggleARAgingSummaryFilterDrawer(toggle)),
});

export function withARAgingSummaryActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithARAgingSummaryActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithARAgingSummaryActionsProps>
  >;
}
