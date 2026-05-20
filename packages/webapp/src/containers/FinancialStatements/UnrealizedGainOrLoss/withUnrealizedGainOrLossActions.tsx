// @ts-nocheck
import { connect } from 'react-redux';
import { toggleUnrealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleUnrealizedGainOrLossFilterDrawer: (toggle) =>
    dispatch(toggleUnrealizedGainOrLossFilterDrawer(toggle)),
});

export const withUnrealizedGainOrLossActions = connect(null, mapDispatchToProps);
