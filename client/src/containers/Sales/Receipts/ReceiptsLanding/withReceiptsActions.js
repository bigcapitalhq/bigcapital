import { connect } from 'react-redux';
import { setReceiptsTableState } from 'store/receipts/receipts.actions';

const mapDispatchToProps = (dispatch) => ({
  setReceiptsTableState: (queries) => dispatch(setReceiptsTableState(queries)),
});

export default connect(null, mapDispatchToProps);
