// @ts-nocheck
import { connect } from 'react-redux';
import { toggleVendorsTransactionsFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleVendorsTransactionsFilterDrawer: (toggle) =>
    dispatch(toggleVendorsTransactionsFilterDrawer(toggle)),
});

export const withVendorsTransactionsActions = connect(null, mapActionsToProps);
