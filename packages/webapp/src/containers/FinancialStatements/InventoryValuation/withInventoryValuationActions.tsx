import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { toggleInventoryValuationFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithInventoryValuationActionsProps {
  toggleInventoryValuationFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithInventoryValuationActionsProps => ({
  toggleInventoryValuationFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleInventoryValuationFilterDrawer(toggle)),
});

export const withInventoryValuationActions = connect(null, mapDispatchToProps);
