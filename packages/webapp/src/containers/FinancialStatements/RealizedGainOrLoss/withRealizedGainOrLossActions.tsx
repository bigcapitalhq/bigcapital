// @ts-nocheck
import { connect } from 'react-redux';
import { toggleRealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleRealizedGainOrLossFilterDrawer: (toggle) =>
    dispatch(toggleRealizedGainOrLossFilterDrawer(toggle)),
});

export const withRealizedGainOrLossActions = connect(null, mapDispatchToProps);
