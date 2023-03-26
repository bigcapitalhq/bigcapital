// @ts-nocheck
import { connect } from 'react-redux';
import { toggleUnrealizedGainOrLossFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleUnrealizedGainOrLossFilterDrawer: (toggle) =>
    dispatch(toggleUnrealizedGainOrLossFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
