import { connect } from 'react-redux';
import { getUserDetails } from 'store/users/users.reducer';
import { getDialogPayload } from 'store/dashboard/dashboard.reducer';
import t from 'store/types';

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'user-form');

  return {
    dialogName: 'user-form',
    payload: { action: 'new', id: null },
    userDetails:
      dialogPayload.action === 'edit'
        ? getUserDetails(state, dialogPayload.user.id)
        : {},
  };
};

export default connect(mapStateToProps, null);
