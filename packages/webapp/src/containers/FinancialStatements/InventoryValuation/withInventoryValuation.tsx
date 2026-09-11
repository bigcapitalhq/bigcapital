import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getInventoryValuationFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithInventoryValuationProps {
  inventoryValuationDrawerFilter: ReturnType<
    typeof getInventoryValuationFilterDrawer
  >;
}

export const withInventoryValuation = <
  Props,
  Mapped extends object = WithInventoryValuationProps,
>(
  mapState?: MapState<WithInventoryValuationProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithInventoryValuationProps = {
      inventoryValuationDrawerFilter: getInventoryValuationFilterDrawer(state),
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
