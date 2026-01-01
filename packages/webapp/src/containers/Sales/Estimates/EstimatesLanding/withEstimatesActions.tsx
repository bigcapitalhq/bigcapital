// @ts-nocheck
import { connect } from 'react-redux';
import {
  setEstimatesTableState,
  resetEstimatesTableState,
  setEstimatesSelectedRows,
} from '@/store/Estimate/estimates.actions';

const mapDispatchToProps = (dispatch) => ({
  setEstimatesTableState: (state) => dispatch(setEstimatesTableState(state)),
  resetEstimatesTableState: () => dispatch(resetEstimatesTableState()),
  setEstimatesSelectedRows: (selectedRows) => dispatch(setEstimatesSelectedRows(selectedRows)),
});

export const withEstimatesActions = connect(null, mapDispatchToProps);
