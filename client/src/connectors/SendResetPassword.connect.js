import { connect } from 'react-redux';
import { submitSendResetPassword } from 'store/authentication/authentication.actions';

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => ({
  requestSendResetPassword: (email) =>
    dispatch(submitSendResetPassword({ email })),
});

export default connect(mapStateToProps, mapDispatchToProps);
