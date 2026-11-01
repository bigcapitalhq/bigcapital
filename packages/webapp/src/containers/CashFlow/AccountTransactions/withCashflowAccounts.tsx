import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getCashflowAccountsTableStateFactory } from '@/store/cashflow-accounts/cashflow-accounts.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithCashflowAccountsProps {
  cashflowAccountsTableState: ReturnType<
    ReturnType<typeof getCashflowAccountsTableStateFactory>
  >;
}

export const withCashflowAccounts = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithCashflowAccountsProps,
>(
  mapState?: MapState<WithCashflowAccountsProps, Props, Mapped>,
) => {
  const getCashflowAccountsTableState = getCashflowAccountsTableStateFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithCashflowAccountsProps = {
      cashflowAccountsTableState: getCashflowAccountsTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
