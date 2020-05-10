import { connect } from 'react-redux';
import {
  fetchUsers,
  fetchUser,
  deleteUser,
  inactiveUser,
  editUser,
} from 'store/users/users.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestFetchUsers: () => dispatch(fetchUsers({})),
  requestFetchUser: (id) => dispatch(fetchUser({ id })),
  requestDeleteUser: (id) => dispatch(deleteUser({ id })),
  requestInactiveUser: (id) => dispatch(inactiveUser({ id })),
  requestEditUser: (id, form) => dispatch(editUser({ form, id })),
});

export default connect(null, mapDispatchToProps);
