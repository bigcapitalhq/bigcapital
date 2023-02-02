// @ts-nocheck
import { connect } from 'react-redux';
import {
  getEstimatesTableStateFactory,
  isEstimatesTableStateChangedFactory,
} from '@/store/Estimate/estimates.selectors';

export default (mapState) => {
  const getEstimatesTableState = getEstimatesTableStateFactory();
  const isEstimatesTableStateChanged = isEstimatesTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      estimatesTableState: getEstimatesTableState(state, props),
      estimatesTableStateChanged: isEstimatesTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
