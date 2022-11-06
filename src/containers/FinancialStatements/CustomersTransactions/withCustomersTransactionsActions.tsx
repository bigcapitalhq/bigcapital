// @ts-nocheck
import { connect } from 'react-redux';
import { toggleCustomersTransactionsFilterDrawer } from '@/store/financialStatement/financialStatements.actions';


const mapActionsToProps = (dispatch) => ({
  toggleCustomersTransactionsFilterDrawer: (toggle) =>
    dispatch(toggleCustomersTransactionsFilterDrawer(toggle)),
});

export default connect(null, mapActionsToProps);
