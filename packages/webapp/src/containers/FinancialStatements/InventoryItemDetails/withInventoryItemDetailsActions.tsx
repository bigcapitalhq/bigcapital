// @ts-nocheck
import { connect } from 'react-redux';
import { toggleInventoryItemDetailsFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleInventoryItemDetailsFilterDrawer: (toggle) =>
    dispatch(toggleInventoryItemDetailsFilterDrawer(toggle)),
});

export default connect(null, mapActionsToProps);
