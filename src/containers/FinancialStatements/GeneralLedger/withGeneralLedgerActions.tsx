// @ts-nocheck
import { connect } from 'react-redux';
import {
  toggleGeneralLedgerFilterDrawer,
} from '@/store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleGeneralLedgerFilterDrawer: (toggle) =>
    dispatch(toggleGeneralLedgerFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
