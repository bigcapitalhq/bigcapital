// @ts-nocheck
import { connect } from 'react-redux';
import { toggleCustomersTransactionsFilterDrawer } from '@/store/financialStatement/financialStatements.actions';


const mapActionsToProps = (dispatch) => ({
  toggleCustomersTransactionsFilterDrawer: (toggle) =>
    dispatch(toggleCustomersTransactionsFilterDrawer(toggle)),
});

export const withCustomersTransactionsActions = connect(null, mapActionsToProps);
