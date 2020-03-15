import {connect} from 'react-redux';
import {
  fetchUsers,
  fetchUser,
  deleteUser,
} from 'store/users/users.actions';
import t from 'store/types';

export const mapStateToProps = (state, props) => ({
  usersList: state.users.list
});

export const mapDispatchToProps = (dispatch) => ({
  openDialog: (name, payload) => dispatch({ type: t.OPEN_DIALOG, name, payload }),
  closeDialog: (name, payload) => dispatch({ type: t.CLOSE_DIALOG, name, payload }),

  fetchUsers: () => dispatch(fetchUsers({  })),
  fetchUser: (id) => dispatch(fetchUser({ id })),
  deleteUser: (id) => dispatch(deleteUser({ id })),
});

export default connect(mapStateToProps, mapDispatchToProps);