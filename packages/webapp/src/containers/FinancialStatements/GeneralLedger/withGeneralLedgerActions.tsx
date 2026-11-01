import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleGeneralLedgerFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithGeneralLedgerActionsProps {
  toggleGeneralLedgerFilterDrawer: (toggle?: boolean) => void;
}

const mapDispatchToProps = (
  dispatch: Dispatch,
): WithGeneralLedgerActionsProps => ({
  toggleGeneralLedgerFilterDrawer: (toggle) =>
    dispatch(toggleGeneralLedgerFilterDrawer(toggle)),
});

export function withGeneralLedgerActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithGeneralLedgerActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithGeneralLedgerActionsProps>
  >;
}
