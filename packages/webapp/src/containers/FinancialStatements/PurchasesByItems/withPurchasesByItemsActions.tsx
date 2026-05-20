// @ts-nocheck
import { connect } from 'react-redux';
import { togglePurchasesByItemsFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export const mapDispatchToProps = (dispatch) => ({
  togglePurchasesByItemsFilterDrawer: (toggle) =>
    dispatch(togglePurchasesByItemsFilterDrawer(toggle)),
});

export const withPurchasesByItemsActions = connect(null, mapDispatchToProps);
