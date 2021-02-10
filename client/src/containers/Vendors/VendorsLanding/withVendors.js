import { connect } from 'react-redux';
import {
  getVendorsTableStateFactory,
} from 'store/vendors/vendors.selectors';

export default (mapState) => {
  const getVendorsTableState = getVendorsTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      vendorsTableState: getVendorsTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
