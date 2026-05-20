// @ts-nocheck
import { connect } from 'react-redux';
import {
  toggleGeneralLedgerFilterDrawer,
} from '@/store/financial-statement/financial-statements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleGeneralLedgerFilterDrawer: (toggle) =>
    dispatch(toggleGeneralLedgerFilterDrawer(toggle)),
});

export const withGeneralLedgerActions = connect(null, mapDispatchToProps);
