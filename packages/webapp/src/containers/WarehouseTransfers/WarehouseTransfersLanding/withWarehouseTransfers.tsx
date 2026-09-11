import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';
import {
  getWarehouseTransfersTableStateFactory,
  isWarehouseTransferTableStateChangedFactory,
} from '@/store/warehouse-transfer/warehouse-transfer.selector';

export interface WithWarehouseTransfersProps {
  warehouseTransferTableState: ReturnType<
    ReturnType<typeof getWarehouseTransfersTableStateFactory>
  >;
  warehouseTransferTableStateChanged: ReturnType<
    ReturnType<typeof isWarehouseTransferTableStateChangedFactory>
  >;
}

export const withWarehouseTransfers = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithWarehouseTransfersProps,
>(
  mapState?: MapState<WithWarehouseTransfersProps, Props, Mapped>,
) => {
  const getWarehouseTransferTableState =
    getWarehouseTransfersTableStateFactory();
  const isWarehouseTransferTableChanged =
    isWarehouseTransferTableStateChangedFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithWarehouseTransfersProps = {
      warehouseTransferTableState: getWarehouseTransferTableState(state, props),
      warehouseTransferTableStateChanged:
        isWarehouseTransferTableChanged(state),
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
