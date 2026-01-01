// @ts-nocheck
import { connect } from 'react-redux';
import { toggleInventoryValuationFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  toggleInventoryValuationFilterDrawer: (toggle) =>
    dispatch(toggleInventoryValuationFilterDrawer(toggle)),
});

export const withInventoryValuationActions = connect(null, mapDispatchToProps);
