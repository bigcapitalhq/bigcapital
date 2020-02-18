import { combineReducers } from 'redux';
import authentication from './authentication';
import dashboard from './dashboard';
// import accounts from './accounts';
// import users from './users';

export default combineReducers({
  authentication,
  dashboard,
  // users,
  // accounts,
});