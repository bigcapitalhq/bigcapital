  import { connect } from 'react-redux';
import {
  getReceiptsTableStateFactory,
} from 'store/receipts/receipts.selector';

export default (mapState) => {
  const getReceiptsTableState = getReceiptsTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      receiptTableState: getReceiptsTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
