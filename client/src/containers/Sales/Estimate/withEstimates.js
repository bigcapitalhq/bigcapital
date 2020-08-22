import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getEstimateCurrentPageFactory,
  getEstimatesTableQueryFactory,
  getEstimatesPaginationMetaFactory,
} from 'store/Estimate/estimates.selectors';

export default (mapState) => {
  const getEstimatesItems = getEstimateCurrentPageFactory();
  const getEstimatesPaginationMeta = getEstimatesPaginationMetaFactory();
  const getEstimatesTableQuery = getEstimatesTableQueryFactory();

  const mapStateToProps = (state, props) => {
    const query = getEstimatesTableQuery(state, props);
  
    const mapped = {
      estimatesCurrentPage: getEstimatesItems(state, props, query),
      estimateViews: getResourceViews(state, props, 'sales_estimates'),
      estimateItems: state.sales_estimates.items,
      estimateTableQuery: query,
      estimatesPageination: getEstimatesPaginationMeta(state, props, query),
      estimatesLoading: state.sales_estimates.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
