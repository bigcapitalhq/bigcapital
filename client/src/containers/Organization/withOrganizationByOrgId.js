import { connect } from 'react-redux';
import {
  getOrganizationByOrgIdFactory,
} from 'store/organizations/organizations.selectors';

export default (mapState) => {
  const getOrganizationByOrgId = getOrganizationByOrgIdFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      organization: getOrganizationByOrgId(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};