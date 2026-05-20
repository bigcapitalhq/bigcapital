// @ts-nocheck
import { connect } from 'react-redux';
import { toggleCustomersBalanceSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleCustomerBalanceFilterDrawer: (toggle) =>
    dispatch(toggleCustomersBalanceSummaryFilterDrawer(toggle)),
});

export const withCustomersBalanceSummaryActions = connect(null, mapActionsToProps);
