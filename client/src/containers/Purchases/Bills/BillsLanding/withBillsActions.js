import { connect } from 'react-redux';
import { setBillsTableState } from 'store/Bills/bills.actions';

const mapDispatchToProps = (dispatch) => ({
  setBillsTableState: (queries) => dispatch(setBillsTableState(queries)),
});

export default connect(null, mapDispatchToProps);
