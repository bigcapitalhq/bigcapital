import {connect} from 'react-redux';
import {
  submitUser,
  editUser,
  fetchUser,
} from 'store/users/users.actions';
import {
  getUserDetails
} from 'store/users/users.reducer';
import { getDialogPayload } from 'store/dashboard/dashboard.reducer';
import t from 'store/types';

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'user-form');

  return {
    name: 'user-form',
    payload: {action: 'new', id: null},
    userDetails: dialogPayload.action === 'edit'
      ? getUserDetails(state, dialogPayload.user.id) : {},
  };
};

export const mapDispatchToProps = (dispatch) => ({
  openDialog: (name, payload) => dispatch({ type: t.OPEN_DIALOG, name, payload }),
  closeDialog: (name, payload) => dispatch({ type: t.CLOSE_DIALOG, name, payload }),
  submitUser: (form) => dispatch(submitUser({ form })),
  editUser: (id, form) => dispatch(editUser({ form, id })),
  fetchUser: (id) => dispatch(fetchUser({ id })),
});

export default connect(mapStateToProps, mapDispatchToProps);