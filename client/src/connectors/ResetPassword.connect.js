import { connect } from 'react-redux';
import { submitResetPassword } from 'store/resetPassword/resetPassword.action';

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => ({
  requestResetPassword: (password) =>
    dispatch(submitResetPassword({password})),
});

export default connect(mapStateToProps, mapDispatchToProps);
