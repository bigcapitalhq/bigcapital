// @ts-nocheck
import { connect } from 'react-redux';
import { toggleSalesByItemsFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  toggleSalesByItemsFilterDrawer: (toggle) =>
    dispatch(toggleSalesByItemsFilterDrawer(toggle)),
});

export const withSalesByItemsActions = connect(null, mapDispatchToProps);
