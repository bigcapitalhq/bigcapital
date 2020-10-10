import { connect } from 'react-redux';
import {
  fetchOrganizations,
} from 'store/organizations/organizations.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestOrganizationsList: () => dispatch(fetchOrganizations()),
});

export default connect(null, mapDispatchToProps);