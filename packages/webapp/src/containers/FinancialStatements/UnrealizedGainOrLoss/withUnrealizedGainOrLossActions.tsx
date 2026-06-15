import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { toggleUnrealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithUnrealizedGainOrLossActionsProps {
  toggleUnrealizedGainOrLossFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithUnrealizedGainOrLossActionsProps => ({
  toggleUnrealizedGainOrLossFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleUnrealizedGainOrLossFilterDrawer(toggle)),
});

export const withUnrealizedGainOrLossActions = connect(
  null,
  mapDispatchToProps,
);
