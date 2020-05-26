import { isAuthenticated } from 'store/authentication/authentication.reducer'
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
  return {
    isAuthorized: isAuthenticated(state),
  };
};

export default connect(mapStateToProps);