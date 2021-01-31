import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const {
      isOrganizationSetupCompleted,
      isOrganizationInitialized,
      isOrganizationSeeded,
  
      isSubscriptionActive
    } = props;

    const mapped = {
      isCongratsStep: isOrganizationSetupCompleted,
      isSubscriptionStep: !isSubscriptionActive,
      isInitializingStep: isSubscriptionActive && !isOrganizationInitialized,
      isOrganizationStep: isOrganizationInitialized && !isOrganizationSeeded,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
