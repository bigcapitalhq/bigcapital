import { connect } from 'react-redux';
import {
  getOrganizationByTenantIdFactory,
} from 'store/organizations/organizations.selectors';

export default (mapState) => {
  const getOrgByTenId = getOrganizationByTenantIdFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      organization: getOrgByTenId(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};