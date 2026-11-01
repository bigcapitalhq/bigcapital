import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getVendorsTransactionsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithVendorsTransactionProps {
  vendorsTransactionsDrawerFilter: ReturnType<
    typeof getVendorsTransactionsFilterDrawer
  >;
}

export const withVendorsTransaction = <
  Props,
  Mapped extends object = WithVendorsTransactionProps,
>(
  mapState?: MapState<WithVendorsTransactionProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithVendorsTransactionProps = {
      vendorsTransactionsDrawerFilter:
        getVendorsTransactionsFilterDrawer(state),
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
