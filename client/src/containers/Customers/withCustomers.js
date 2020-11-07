import { connect } from 'react-redux';
import { getCustomersItems, getCustomersListFactory } from 'store/customers/customers.selectors';
import { getResourceViews } from 'store/customViews/customViews.selectors';

export default (mapState) => {
  const getCustomersList = getCustomersListFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      customersViews: getResourceViews(state, props, 'customers'),
      customersItems: getCustomersList(state, props),
      customers: getCustomersItems(state, state.customers.currentViewId),
      customersLoading: state.customers.loading,
      customerErrors: state.customers.errors,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
