import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getPurchasesByItemsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithPurchasesByItemsProps {
  purchasesByItemsDrawerFilter: ReturnType<
    typeof getPurchasesByItemsFilterDrawer
  >;
}

export const withPurchasesByItems = <
  Props,
  Mapped extends object = WithPurchasesByItemsProps,
>(
  mapState?: MapState<WithPurchasesByItemsProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithPurchasesByItemsProps = {
      purchasesByItemsDrawerFilter: getPurchasesByItemsFilterDrawer(state),
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
