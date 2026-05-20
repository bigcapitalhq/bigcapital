// @ts-nocheck
import { connect } from 'react-redux';
import { toggleProjectProfitabilitySummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleProjectProfitabilitySummaryFilterDrawer: (toggle) =>
    dispatch(toggleProjectProfitabilitySummaryFilterDrawer(toggle)),
});

export const withProjectProfitabilitySummaryActions = connect(null, mapDispatchToProps);
