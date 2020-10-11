import { connect } from 'react-redux';
import {
  fetchOrganizations,
  buildTenant,
  seedTenant,
} from 'store/organizations/organizations.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestOrganizationsList: () => dispatch(fetchOrganizations()),
  requestBuildTenant: () => dispatch(buildTenant()),
  requestSeedTenant: () => dispatch(seedTenant()),
});

export default connect(null, mapDispatchToProps);