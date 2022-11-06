// @ts-nocheck
import { connect } from 'react-redux';
import {
  setCustomersTableState,
  resetCustomersTableState
} from '@/store/customers/customers.actions';

export const mapDispatchToProps = (dispatch) => ({
  setCustomersTableState: (state) => dispatch(setCustomersTableState(state)),
  resetCustomersTableState: () => dispatch(resetCustomersTableState()),
});

export default connect(null, mapDispatchToProps);
