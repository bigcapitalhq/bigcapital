import { connect } from 'react-redux';
import { getCustomersItems } from 'store/customers/customers.selectors';
import { getResourceViews } from 'store/customViews/customViews.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
 
    const mapped = {
      customersViews: getResourceViews(state, 'customers'),
      customersItems: Object.values(state.customers.items),
      customers: getCustomersItems(state, state.customers.currentViewId),
      customersLoading: state.customers.loading,
      customerErrors: state.customers.errors,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
