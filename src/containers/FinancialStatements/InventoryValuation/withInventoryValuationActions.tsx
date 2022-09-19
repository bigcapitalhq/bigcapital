// @ts-nocheck
import { connect } from 'react-redux';
import { toggleInventoryValuationFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  toggleInventoryValuationFilterDrawer: (toggle) =>
    dispatch(toggleInventoryValuationFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
