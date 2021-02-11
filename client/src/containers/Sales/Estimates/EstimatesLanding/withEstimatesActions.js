import { connect } from 'react-redux';
import {
  setEstimatesTableState,
} from 'store/Estimate/estimates.actions';

const mapDispatchToProps = (dispatch) => ({
  setEstimatesTableState: (state) => dispatch(setEstimatesTableState(state)),
});

export default connect(null, mapDispatchToProps);
