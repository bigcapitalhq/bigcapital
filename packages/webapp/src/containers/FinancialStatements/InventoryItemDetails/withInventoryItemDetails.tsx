import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getInventoryItemDetailsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithInventoryItemDetailsProps {
  inventoryItemDetailDrawerFilter: ReturnType<
    typeof getInventoryItemDetailsFilterDrawer
  >;
}

export const withInventoryItemDetails = <
  Props = unknown,
  Mapped extends object = WithInventoryItemDetailsProps,
>(
  mapState?: MapState<WithInventoryItemDetailsProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithInventoryItemDetailsProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithInventoryItemDetailsProps = {
      inventoryItemDetailDrawerFilter:
        getInventoryItemDetailsFilterDrawer(state),
    };
    return (mapState ? mapState(mapped, state, props) : mapped) as
      | WithInventoryItemDetailsProps
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
