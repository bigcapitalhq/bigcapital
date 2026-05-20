// @ts-nocheck
import { connect } from 'react-redux';
import { toggleSalesTaxLiabilitySummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleSalesTaxLiabilitySummaryFilterDrawer: (toggle) =>
    dispatch(toggleSalesTaxLiabilitySummaryFilterDrawer(toggle)),
});

export const withSalesTaxLiabilitySummaryActions = connect(null, mapDispatchToProps);
