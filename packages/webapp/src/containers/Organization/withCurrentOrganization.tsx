// @ts-nocheck
import { connect } from 'react-redux';
import { getCurrentOrganizationFactory } from '@/store/authentication/authentication.selectors';

export default (mapState) => {
  const getCurrentOrganization = getCurrentOrganizationFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      organizationTenantId: state.authentication.organizationId,
      organizationId: state.authentication.organization,
      organization: getCurrentOrganization(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
