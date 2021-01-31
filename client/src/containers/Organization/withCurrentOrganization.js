import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      organizationTenantId: state.authentication.organizationId,
      organizationId: state.authentication.organization,
    };
    return (mapState) ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};