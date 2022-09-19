// @ts-nocheck
import { isAuthenticated } from '@/store/authentication/authentication.reducer';
import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      isAuthorized: isAuthenticated(state),
      authenticatedUserId: state.authentication.userId,
      currentOrganizationId: state.authentication?.organizationId,
      currentTenantId: state.authentication?.tenantId,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
