import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getEstimateCurrentPage,
  getEstimatesTableQuery,
  getEstimatesPaginationMetaFactory,
} from 'store/Estimate/estimates.selectors';

function withEstimates(mapSate) {
  const mapStateToProps = (state, props) => {
    const query = getEstimatesTableQuery(state, props);
    const mapped = {
      estimateViews: getResourceViews(state, props, 'estimates'),
      estimateItems: state.estiamte.items,
      estimateTableQuery: query,
      estimatesLoading: state.estiamte.loading,
    };
    return mapSate ? mapSate(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
}

export default withEstimates;
