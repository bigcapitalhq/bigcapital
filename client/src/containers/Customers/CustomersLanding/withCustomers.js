import { connect } from 'react-redux';
import { getCustomersTableStateFactory } from 'store/customers/customers.selectors';

export default (mapState) => {
  const getCustomersTableState = getCustomersTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      customersTableState: getCustomersTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
