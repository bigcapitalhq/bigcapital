import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import type { ComponentType } from 'react';
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

export function withBills<
  Props = unknown,
  Mapped extends object = WithBillsProps,
>(mapState?: MapState<WithBillsProps, Props, Mapped>) {
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
}
