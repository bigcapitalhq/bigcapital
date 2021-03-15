import { connect } from 'react-redux';
import {
  fetchOrganizations,
  buildTenant,
  seedTenant,
  setOrganizationSetupCompleted,
} from 'store/organizations/organizations.actions';

const mapDispatchToProps = (dispatch) => ({
  requestOrganizationBuild: () => dispatch(buildTenant()),
  requestOrganizationSeed: () => dispatch(seedTenant()),
  requestAllOrganizations: () => dispatch(fetchOrganizations()),

  setOrganizationSetupCompleted: (congrats) => dispatch(setOrganizationSetupCompleted(congrats)),
});

export default connect(null, mapDispatchToProps);