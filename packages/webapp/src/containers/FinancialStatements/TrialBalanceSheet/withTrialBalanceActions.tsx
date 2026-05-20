// @ts-nocheck
import { connect } from 'react-redux';
import { toggleTrialBalanceSheetFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export const mapDispatchToProps = (dispatch) => ({
  toggleTrialBalanceFilterDrawer: (toggle) =>
    dispatch(toggleTrialBalanceSheetFilterDrawer(toggle)),
});

export const withTrialBalanceActions = connect(null, mapDispatchToProps);
