import { connect } from 'react-redux';
import {
  fetchUsers,
  fetchUser,
  deleteUser,
  inactiveUser,
  editUser,
} from 'store/users/users.actions';
import t from 'store/types';
import { getUserDetails } from 'store/users/users.reducer';
import { getDialogPayload } from 'store/dashboard/dashboard.reducer';

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'userList-form');

  return {
    name: 'userList-form',
    payload: { action: 'new', id: null },
    userDetails:
      dialogPayload.action === 'edit'
        ? getUserDetails(state, dialogPayload.user.id)
        : {},
    editUser:
      dialogPayload && dialogPayload.action === 'edit'
        ? state.users.list.results[dialogPayload.user.id]
        : {},
    usersList: state.users.list.results,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  openDialog: (name, payload) =>
    dispatch({ type: t.OPEN_DIALOG, name, payload }),
  closeDialog: (name, payload) =>
    dispatch({ type: t.CLOSE_DIALOG, name, payload }),

  requestFetchUsers: () => dispatch(fetchUsers({})),
  requestFetchUser: (id) => dispatch(fetchUser({ id })),
  requestDeleteUser: (id) => dispatch(deleteUser({ id })),
  requestInactiveUser: (id) => dispatch(inactiveUser({ id })),
  requestEditUser: (id, form) => dispatch(editUser({ form, id })),
});

export default connect(mapStateToProps, mapDispatchToProps);
