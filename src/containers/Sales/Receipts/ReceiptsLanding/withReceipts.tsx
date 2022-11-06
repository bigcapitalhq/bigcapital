// @ts-nocheck
import { connect } from 'react-redux';
import {
  getReceiptsTableStateFactory,
  receiptsTableStateChangedFactory,
} from '@/store/receipts/receipts.selector';

export default (mapState) => {
  const getReceiptsTableState = getReceiptsTableStateFactory();
  const receiptsTableStateChanged = receiptsTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      receiptTableState: getReceiptsTableState(state, props),
      receiptsTableStateChanged: receiptsTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
