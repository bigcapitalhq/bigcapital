import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  getReceiptsSelectedRowsFactory,
  getReceiptsTableStateFactory,
  receiptsTableStateChangedFactory,
} from '@/store/receipts/receipts.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithReceiptsProps {
  receiptTableState: ReturnType<
    ReturnType<typeof getReceiptsTableStateFactory>
  >;
  receiptsTableStateChanged: ReturnType<
    ReturnType<typeof receiptsTableStateChangedFactory>
  >;
  receiptSelectedRows: ReturnType<
    ReturnType<typeof getReceiptsSelectedRowsFactory>
  >;
}

export const withReceipts = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithReceiptsProps,
>(
  mapState?: MapState<WithReceiptsProps, Props, Mapped>,
) => {
  const getReceiptsTableState = getReceiptsTableStateFactory();
  const receiptsTableStateChanged = receiptsTableStateChangedFactory();
  const getSelectedRows = getReceiptsSelectedRowsFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithReceiptsProps = {
      receiptTableState: getReceiptsTableState(state, props),
      receiptsTableStateChanged: receiptsTableStateChanged(state),
      receiptSelectedRows: getSelectedRows(state),
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
