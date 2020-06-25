import { connect } from 'react-redux';
import {
  getAccountsItems,
} from 'store/accounts/accounts.selectors';
import {
  getResourceViews,
} from 'store/customViews/customViews.selectors';


export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      accountsViews: getResourceViews(state, props, 'accounts'),
      accounts: getAccountsItems(state, props),
      accountsTypes: state.accounts.accountsTypes,
    
      accountsTableQuery: state.accounts.tableQuery,
      accountsLoading: state.accounts.loading,
      accountErrors: state.accounts.errors,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  
  return connect(mapStateToProps);
};
