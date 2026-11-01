import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getSalesByItemsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithSalesByItemsProps {
  salesByItemsDrawerFilter: ReturnType<typeof getSalesByItemsFilterDrawer>;
}

export const withSalesByItems = <
  Props,
  Mapped extends object = WithSalesByItemsProps,
>(
  mapState?: MapState<WithSalesByItemsProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithSalesByItemsProps = {
      salesByItemsDrawerFilter: getSalesByItemsFilterDrawer(state),
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
