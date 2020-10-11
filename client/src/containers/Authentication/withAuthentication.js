import { isAuthenticated } from 'store/authentication/authentication.reducer'
import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      isAuthorized: isAuthenticated(state),
      user: state.authentication.user,
      currentOrganizationId: state.authentication?.tenant?.organization_id,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};