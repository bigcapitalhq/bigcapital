// @ts-nocheck
import { connect } from 'react-redux';
import { getCashflowAccountsTableStateFactory } from '@/store/CashflowAccounts/CashflowAccounts.selectors';

export default (mapState) => {
  const getCashflowAccountsTableState = getCashflowAccountsTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      cashflowAccountsTableState: getCashflowAccountsTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
