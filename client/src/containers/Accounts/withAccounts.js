import { connect } from 'react-redux';
import {
  getAccountsTableStateFactory,
} from 'store/accounts/accounts.selectors';

export default (mapState) => {
  const getAccountsTableState = getAccountsTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      accountsTableState: getAccountsTableState(state, props),
      accountsSelectedRows: null,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
