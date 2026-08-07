import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getCashflowAccountsTableStateFactory } from '@/store/cashflow-accounts/cashflow-accounts.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithCashflowAccountsProps {
  cashflowAccountsTableState: ReturnType<
    ReturnType<typeof getCashflowAccountsTableStateFactory>
  >;
}

export const withCashflowAccounts = <
  Props extends { location?: { search: string } },
>(
  mapState?: MapState<WithCashflowAccountsProps, Props>,
) => {
  const getCashflowAccountsTableState = getCashflowAccountsTableStateFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithCashflowAccountsProps = {
      cashflowAccountsTableState: getCashflowAccountsTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
