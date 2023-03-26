// @ts-nocheck
import { connect } from 'react-redux';
import {
  setEstimatesTableState,
  resetEstimatesTableState,
} from '@/store/Estimate/estimates.actions';

const mapDispatchToProps = (dispatch) => ({
  setEstimatesTableState: (state) => dispatch(setEstimatesTableState(state)),
  resetEstimatesTableState: () => dispatch(resetEstimatesTableState()),
});

export default connect(null, mapDispatchToProps);
