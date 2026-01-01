// @ts-nocheck
import { connect } from 'react-redux';
import { toggleInventoryItemDetailsFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleInventoryItemDetailsFilterDrawer: (toggle) =>
    dispatch(toggleInventoryItemDetailsFilterDrawer(toggle)),
});

export const withInventoryItemDetailsActions = connect(null, mapActionsToProps);
