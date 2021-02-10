import { connect } from 'react-redux';
import {
  setCustomersTableState
} from 'store/customers/customers.actions';

export const mapDispatchToProps = (dispatch) => ({
  setCustomersTableState: (state) => dispatch(setCustomersTableState(state)),
});

export default connect(null, mapDispatchToProps);
