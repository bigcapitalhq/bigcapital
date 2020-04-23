import { connect } from 'react-redux';
import { submitInvite, submitSendInvite } from 'store/Invite/invite.action';

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitInvite: (form, token) => dispatch(submitInvite({ form, token })),
  requestSendInvite: (form) => dispatch(submitSendInvite({ form })),
});

export default connect(mapStateToProps, mapDispatchToProps);
