// @ts-nocheck
import { connect } from 'react-redux';
import {
  toggleBalanceSheetFilterDrawer,
} from '@/store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleBalanceSheetFilterDrawer: (toggle) =>
    dispatch(toggleBalanceSheetFilterDrawer(toggle)),
});

export const withBalanceSheetActions = connect(null, mapDispatchToProps);
