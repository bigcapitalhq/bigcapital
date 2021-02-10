import { connect } from 'react-redux';
import { setVendorsTableState } from 'store/vendors/vendors.actions';

const mapDispatchToProps = (dispatch) => ({
  setVendorsTableState: (queries) => dispatch(setVendorsTableState(queries)),
});

export default connect(null, mapDispatchToProps);
