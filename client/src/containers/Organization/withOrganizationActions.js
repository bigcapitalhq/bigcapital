import { connect } from 'react-redux';
import {
  fetchOrganizations,
  buildTenant,
  seedTenant,
} from 'store/organizations/organizations.actions';

const mapDispatchToProps = (dispatch) => ({
  requestOrganizationBuild: () => dispatch(buildTenant()),
  requestOrganizationSeed: () => dispatch(seedTenant()),
  requestAllOrganizations: () => dispatch(fetchOrganizations()),
});

export default connect(null, mapDispatchToProps);