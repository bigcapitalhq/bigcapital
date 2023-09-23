// @ts-nocheck
import { connect } from 'react-redux';
import { toggleSalesTaxLiabilitySummaryFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleSalesTaxLiabilitySummaryFilterDrawer: (toggle) =>
    dispatch(toggleSalesTaxLiabilitySummaryFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
