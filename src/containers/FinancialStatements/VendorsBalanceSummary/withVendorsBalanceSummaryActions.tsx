// @ts-nocheck
import { connect } from 'react-redux';
import { toggleVendorsBalanceSummaryFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleVendorSummaryFilterDrawer: (toggle) =>
    dispatch(toggleVendorsBalanceSummaryFilterDrawer(toggle)),
});

export default connect(null, mapActionsToProps);
