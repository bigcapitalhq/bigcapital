// @ts-nocheck
import { connect } from 'react-redux';
import {
  getReceiptsSelectedRowsFactory,
  getReceiptsTableStateFactory,
  receiptsTableStateChangedFactory,
} from '@/store/receipts/receipts.selector';

export default (mapState) => {
  const getReceiptsTableState = getReceiptsTableStateFactory();
  const receiptsTableStateChanged = receiptsTableStateChangedFactory();
  const getSelectedRows = getReceiptsSelectedRowsFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      receiptTableState: getReceiptsTableState(state, props),
      receiptsTableStateChanged: receiptsTableStateChanged(state, props),
      receiptSelectedRows: getSelectedRows(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
