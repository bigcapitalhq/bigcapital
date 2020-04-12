import {connect} from 'react-redux';
import {getDialogPayload} from 'store/dashboard/dashboard.reducer';

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'account-form');

  return {
    name: 'account-form',
    payload: {action: 'new', id: null, ...dialogPayload},
  };
};

export default connect(mapStateToProps);