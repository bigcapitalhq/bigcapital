import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getInventroyAdjsTableStateFactory } from '@/store/inventory-adjustments/inventory-adjustment.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithInventoryAdjustmentsProps {
  inventoryAdjustmentTableState: ReturnType<
    ReturnType<typeof getInventroyAdjsTableStateFactory>
  >;
  inventoryAdjustmentsSelectedRows: unknown[];
}

export const withInventoryAdjustments = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithInventoryAdjustmentsProps,
>(
  mapState?: MapState<WithInventoryAdjustmentsProps, Props, Mapped>,
) => {
  const getInventoryAdjustmentTableState = getInventroyAdjsTableStateFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithInventoryAdjustmentsProps = {
      inventoryAdjustmentTableState: getInventoryAdjustmentTableState(
        state,
        props,
      ),
      inventoryAdjustmentsSelectedRows: state.inventoryAdjustments.selectedRows,
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
