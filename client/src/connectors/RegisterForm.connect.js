import { connect } from 'react-redux';
import { submitRegister } from 'store/registers/register.action';

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitRegister: (form) => dispatch(submitRegister({ form })),
});

export default connect(mapStateToProps, mapDispatchToProps);
