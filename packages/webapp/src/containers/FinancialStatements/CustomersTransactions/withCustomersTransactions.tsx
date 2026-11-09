import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getCustomersTransactionsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithCustomersTransactionsProps {
  customersTransactionsDrawerFilter: ReturnType<
    typeof getCustomersTransactionsFilterDrawer
  >;
}

export const withCustomersTransactions = <
  Props = unknown,
  Mapped extends object = WithCustomersTransactionsProps,
>(
  mapState?: MapState<WithCustomersTransactionsProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithCustomersTransactionsProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithCustomersTransactionsProps = {
      customersTransactionsDrawerFilter:
        getCustomersTransactionsFilterDrawer(state),
    };
    return (mapState ? mapState(mapped, state, props) : mapped) as
      | WithCustomersTransactionsProps
      | Record<string, unknown>;
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
