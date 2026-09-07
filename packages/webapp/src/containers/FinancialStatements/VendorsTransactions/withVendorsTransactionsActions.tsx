import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { toggleVendorsTransactionsFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithVendorsTransactionsActionsProps {
  toggleVendorsTransactionsFilterDrawer: (toggle?: boolean) => void;
}

export const mapActionsToProps = (
  dispatch: Dispatch,
): WithVendorsTransactionsActionsProps => ({
  toggleVendorsTransactionsFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleVendorsTransactionsFilterDrawer(toggle)),
});

export const withVendorsTransactionsActions = connect(null, mapActionsToProps);
