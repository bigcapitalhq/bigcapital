import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getBillCurrentPageFactory,
  getBillPaginationMetaFactory,
  getBillTableQuery,
} from 'store/Bills/bills.selectors';

export default (mapState) => {
  const getBillsItems = getBillCurrentPageFactory();
  const getBillsPaginationMeta = getBillPaginationMetaFactory();
  const mapStateToProps = (state, props) => {
    const query = getBillTableQuery(state, props);
    const mapped = {
      billsCurrentPage: getBillsItems(state, props, query),
      billsViews: getResourceViews(state, props, 'bills'),
      billsItems: state.bills.items,
      billsTableQuery: query,
      billsPageination: getBillsPaginationMeta(state, props, query),
      billsLoading: state.bills.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
