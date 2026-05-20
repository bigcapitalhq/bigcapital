// @ts-nocheck
import { connect } from 'react-redux';
import { toggleCashFlowStatementFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleCashFlowStatementFilterDrawer: (toggle) =>
    dispatch(toggleCashFlowStatementFilterDrawer(toggle)),
});

export const withCashFlowStatementActions = connect(null, mapDispatchToProps);
