// @ts-nocheck
import { connect } from 'react-redux';
import { getVendorByIdFactory } from '@/store/vendors/vendors.selectors';

export default () => {
  const getVendorById = getVendorByIdFactory();
  const mapStateToProps = (state, props) => ({
    vendor: getVendorById(state, props),
  });
  return connect(mapStateToProps);
};
