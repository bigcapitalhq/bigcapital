// @ts-nocheck
import { connect } from 'react-redux';
import { getVendorByIdFactory } from '@/store/vendors/vendors.selectors';

export const withVendorDetail = () => {
  const getVendorById = getVendorByIdFactory();
  const mapStateToProps = (state, props) => ({
    vendor: getVendorById(state, props),
  });
  return connect(mapStateToProps);
};
