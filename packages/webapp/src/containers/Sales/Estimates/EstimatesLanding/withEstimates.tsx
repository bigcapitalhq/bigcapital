// @ts-nocheck
import { connect } from 'react-redux';
import {
  getEstimatesTableStateFactory,
  isEstimatesTableStateChangedFactory,
  getEstimatesSelectedRowsFactory,
} from '@/store/Estimate/estimates.selectors';

export const withEstimates = (mapState) => {
  const getEstimatesTableState = getEstimatesTableStateFactory();
  const getSelectedRows = getEstimatesSelectedRowsFactory();
  const isEstimatesTableStateChanged = isEstimatesTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      estimatesTableState: getEstimatesTableState(state, props),
      estimatesTableStateChanged: isEstimatesTableStateChanged(state, props),
      estimatesSelectedRows: getSelectedRows(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
