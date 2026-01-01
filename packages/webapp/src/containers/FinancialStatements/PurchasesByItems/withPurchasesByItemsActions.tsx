// @ts-nocheck
import { connect } from 'react-redux';
import { togglePurchasesByItemsFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  togglePurchasesByItemsFilterDrawer: (toggle) =>
    dispatch(togglePurchasesByItemsFilterDrawer(toggle)),
});

export const withPurchasesByItemsActions = connect(null, mapDispatchToProps);
