// @ts-nocheck
import { connect } from 'react-redux';
import { toggleRealizedGainOrLossFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleRealizedGainOrLossFilterDrawer: (toggle) =>
    dispatch(toggleRealizedGainOrLossFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
