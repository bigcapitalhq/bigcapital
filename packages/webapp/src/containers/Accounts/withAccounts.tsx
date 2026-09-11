import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  getAccountsTableStateFactory,
  accountsTableStateChangedFactory,
} from '@/store/accounts/accounts.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithAccountsProps {
  accountsTableState: ReturnType<
    ReturnType<typeof getAccountsTableStateFactory>
  >;
  accountsTableStateChanged: ReturnType<
    ReturnType<typeof accountsTableStateChangedFactory>
  >;
  accountsSelectedRows: number[];
}

export function withAccounts<
  Props = unknown,
  Mapped extends object = WithAccountsProps,
>(mapState?: MapState<WithAccountsProps, Props, Mapped>) {
  const getAccountsTableState = getAccountsTableStateFactory();
  const accountsTableStateChanged = accountsTableStateChangedFactory();

  const mapStateToProps: MapStateToProps<
    WithAccountsProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithAccountsProps = {
      accountsTableState: getAccountsTableState(state, props as never),
      accountsTableStateChanged: accountsTableStateChanged(state),
      accountsSelectedRows: state.accounts?.selectedRows || [],
    };
    return mapState
      ? (mapState(mapped, state, props) as WithAccountsProps)
      : mapped;
  };
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
}
