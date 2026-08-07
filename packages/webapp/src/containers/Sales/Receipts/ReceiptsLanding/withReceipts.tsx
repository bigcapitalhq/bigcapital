import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
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

export const withReceipts = <Props extends { location?: { search: string } }>(
  mapState?: MapState<WithReceiptsProps, Props>,
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
  return connect(mapStateToProps);
};
