import { combineReducers } from 'redux';
import accounts from './accounts';
import authentication from './authentication';
import users from './users';

export default combineReducers({
  authentication,
  users,
  accounts,
});