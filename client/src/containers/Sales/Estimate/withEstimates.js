import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getEstimateCurrentPageFactory,
  getEstimatesTableQueryFactory,
  getEstimatesPaginationMetaFactory,
  getEstimatesCurrentViewIdFactory,
} from 'store/Estimate/estimates.selectors';

export default (mapState) => {
  const getEstimatesItems = getEstimateCurrentPageFactory();
  const getEstimatesPaginationMeta = getEstimatesPaginationMetaFactory();
  const getEstimatesTableQuery = getEstimatesTableQueryFactory();
  const getEstimatesCurrentViewId = getEstimatesCurrentViewIdFactory();

  const mapStateToProps = (state, props) => {
    const query = getEstimatesTableQuery(state, props);

    const mapped = {
      estimatesCurrentPage: getEstimatesItems(state, props, query),
      estimatesCurrentViewId: getEstimatesCurrentViewId(state, props),

      estimateViews: getResourceViews(state, props, 'sales_estimates'),
      estimateItems: state.salesEstimates.items,
      
      estimatesTableQuery: query,
      estimatesPageination: getEstimatesPaginationMeta(state, props, query),
      estimatesLoading: state.salesEstimates.loading,

      estimateNumberChanged: state.salesEstimates.journalNumberChanged,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
