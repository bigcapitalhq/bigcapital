// @ts-nocheck
import { connect } from 'react-redux';
import { toggleCashFlowStatementFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleCashFlowStatementFilterDrawer: (toggle) =>
    dispatch(toggleCashFlowStatementFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
