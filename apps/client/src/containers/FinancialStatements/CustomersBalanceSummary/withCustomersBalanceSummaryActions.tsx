// @ts-nocheck
import { connect } from 'react-redux';
import { toggleCustomersBalanceSummaryFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleCustomerBalanceFilterDrawer: (toggle) =>
    dispatch(toggleCustomersBalanceSummaryFilterDrawer(toggle)),
});

export default connect(null, mapActionsToProps);
