// @ts-nocheck
import { connect } from 'react-redux';
import { getVendorsBalanceSummaryFilterDrawer } from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      VendorsSummaryFilterDrawer: getVendorsBalanceSummaryFilterDrawer(
        state,
        props,
      ),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
