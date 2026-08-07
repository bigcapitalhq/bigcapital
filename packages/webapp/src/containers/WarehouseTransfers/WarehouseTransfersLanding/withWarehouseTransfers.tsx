import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
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
>(
  mapState?: MapState<WithWarehouseTransfersProps, Props>,
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
  return connect(mapStateToProps);
};
