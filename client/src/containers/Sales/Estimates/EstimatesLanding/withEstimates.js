import { connect } from 'react-redux';
import {
  getEstimatesTableStateFactory,
} from 'store/Estimate/estimates.selectors';

export default (mapState) => {
  const getEstimatesTableState = getEstimatesTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      estimatesTableState: getEstimatesTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
