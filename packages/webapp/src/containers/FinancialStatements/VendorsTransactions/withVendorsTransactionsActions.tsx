// @ts-nocheck
import { connect } from 'react-redux';
import { toggleVendorsTransactionsFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleVendorsTransactionsFilterDrawer: (toggle) =>
    dispatch(toggleVendorsTransactionsFilterDrawer(toggle)),
});

export const withVendorsTransactionsActions = connect(null, mapActionsToProps);
