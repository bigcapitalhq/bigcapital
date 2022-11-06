// @ts-nocheck
import { connect } from 'react-redux';
import {
  getCustomersTableStateFactory,
  customersTableStateChangedFactory,
} from '@/store/customers/customers.selectors';


export default (mapState) => {
  const getCustomersTableState = getCustomersTableStateFactory();
  const customersTableStateChanged = customersTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      customersTableState: getCustomersTableState(state, props),
      customersTableStateChanged: customersTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
