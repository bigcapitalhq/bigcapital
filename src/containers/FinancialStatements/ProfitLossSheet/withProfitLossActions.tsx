// @ts-nocheck
import { connect } from 'react-redux';
import { toggleProfitLossFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  toggleProfitLossFilterDrawer: (toggle) =>
    dispatch(toggleProfitLossFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
