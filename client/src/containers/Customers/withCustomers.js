import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getCustomerCurrentPageFactory,
  getCustomerPaginationMetaFactory,
  getCustomerTableQueryFactory,
  getCustomersCurrentViewIdFactory,
} from 'store/customers/customers.selectors';

export default (mapState) => {
  const getCustomersList = getCustomerCurrentPageFactory();
  const getCustomerPaginationMeta = getCustomerPaginationMetaFactory();
  const getCustomersCurrentViewId = getCustomersCurrentViewIdFactory();
  const getCustomerTableQuery = getCustomerTableQueryFactory();

  const mapStateToProps = (state, props) => {
    const query = getCustomerTableQuery(state, props);
    const mapped = {
      customers: getCustomersList(state, props, query),
      customersViews: getResourceViews(state, props, 'customers'),
      customersTableQuery: query,
      customerPagination: getCustomerPaginationMeta(state, props, query),
      customersLoading: state.customers.loading,
      customersItems: state.customers.items,
      customersCurrentViewId: getCustomersCurrentViewId(state, props),
      customersSelectedRows: state.customers.selectedRows,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
