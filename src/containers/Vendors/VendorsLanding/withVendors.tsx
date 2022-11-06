// @ts-nocheck
import { connect } from 'react-redux';
import {
  getVendorsTableStateFactory,
  vendorsTableStateChangedFactory,
} from '@/store/vendors/vendors.selectors';

export default (mapState) => {
  const getVendorsTableState = getVendorsTableStateFactory();
  const vendorsTableStateChanged = vendorsTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      vendorsTableState: getVendorsTableState(state, props),
      vendorsTableStateChanged: vendorsTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
