import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getInventoryTurnoverByAmountFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithInventoryTurnoverByAmountProps {
  inventoryTurnoverByAmountDrawerFilter: ReturnType<
    typeof getInventoryTurnoverByAmountFilterDrawer
  >;
}

export const withInventoryTurnoverByAmount = <
  Props,
  Mapped extends object = WithInventoryTurnoverByAmountProps,
>(
  mapState?: MapState<WithInventoryTurnoverByAmountProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithInventoryTurnoverByAmountProps = {
      inventoryTurnoverByAmountDrawerFilter:
        getInventoryTurnoverByAmountFilterDrawer(state),
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
