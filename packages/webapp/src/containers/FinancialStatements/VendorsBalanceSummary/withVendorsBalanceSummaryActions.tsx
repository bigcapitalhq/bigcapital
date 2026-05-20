// @ts-nocheck
import { connect } from 'react-redux';
import { toggleVendorsBalanceSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleVendorSummaryFilterDrawer: (toggle) =>
    dispatch(toggleVendorsBalanceSummaryFilterDrawer(toggle)),
});

export const withVendorsBalanceSummaryActions = connect(null, mapActionsToProps);
