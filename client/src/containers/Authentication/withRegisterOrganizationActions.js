import {
  buildTenant,
  seedTenant,
} from 'store/organization/organization.actions';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => ({
  requestBuildTenant: (id, token) => dispatch(buildTenant({ id, token })),
  requestSeedTenant: (id, token) => dispatch(seedTenant({ id, token })),
});

export default connect(null, mapDispatchToProps);
