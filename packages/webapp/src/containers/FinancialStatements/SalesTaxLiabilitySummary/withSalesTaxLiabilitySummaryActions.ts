// @ts-nocheck
import { connect } from 'react-redux';
import { toggleBalanceSheetFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleSalesTaxLiabilitySummaryFilterDrawer: (toggle) =>
    dispatch(toggleBalanceSheetFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
