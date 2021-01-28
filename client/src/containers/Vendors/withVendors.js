import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';

import {
  getVendorCurrentPageFactory,
  getVendorTableQueryFactory,
  getVendorsPaginationMetaFactory,
  getVendorsCurrentViewIdFactory,
} from 'store/vendors/vendors.selectors';

export default (mapState) => {
  const getVendorsItems = getVendorCurrentPageFactory();
  const getVendorsPaginationMeta = getVendorsPaginationMetaFactory();
  const getVendorsCurrentViewId = getVendorsCurrentViewIdFactory();
  const getVendorTableQuery = getVendorTableQueryFactory();

  const mapStateToProps = (state, props) => {
    const query = getVendorTableQuery(state, props);

    const mapped = {
      vendorsCurrentPage: getVendorsItems(state, props, query),
      vendorViews: getResourceViews(state, props, 'vendors'),
      vendorItems: getVendorsItems(state, props, query),
      vendorTableQuery: query,
      vendorsPageination: getVendorsPaginationMeta(state, props, query),
      vendorsLoading: state.vendors.loading,
      vendorsCurrentViewId: getVendorsCurrentViewId(state, props),
      vendorsSelectedRows: state.vendors.selectedRows,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
