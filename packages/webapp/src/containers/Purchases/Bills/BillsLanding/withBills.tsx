import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import {
  getBillsTableStateFactory,
  billsTableStateChangedFactory,
  getBillsSelectedRowsFactory,
} from '@/store/bills/bills.selectors';

export interface WithBillsProps {
  billsTableState: ReturnType<ReturnType<typeof getBillsTableStateFactory>>;
  billsTableStateChanged: ReturnType<
    ReturnType<typeof billsTableStateChangedFactory>
  >;
  billsSelectedRows: ReturnType<ReturnType<typeof getBillsSelectedRowsFactory>>;
}

export function withBills<Props = unknown>(
  mapState?: MapState<WithBillsProps, Props>,
) {
  const getBillsTableState = getBillsTableStateFactory();
  const billsTableStateChanged = billsTableStateChangedFactory();
  const getBillsSelectedRows = getBillsSelectedRowsFactory();

  const mapStateToProps: MapStateToProps<
    WithBillsProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithBillsProps = {
      billsTableState: getBillsTableState(state, props as never),
      billsTableStateChanged: billsTableStateChanged(state),
      billsSelectedRows: getBillsSelectedRows(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithBillsProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
