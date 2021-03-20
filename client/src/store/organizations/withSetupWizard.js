import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const {
      isOrganizationSetupCompleted,
      isOrganizationInitialized,
      isOrganizationSeeded,
      isSubscriptionActive
    } = props;

    const condits = {
      isCongratsStep: isOrganizationSetupCompleted,
      isSubscriptionStep: !isSubscriptionActive,
      isInitializingStep: isSubscriptionActive && !isOrganizationInitialized,
      isOrganizationStep: isOrganizationInitialized && !isOrganizationSeeded,
    };

    const scenarios = [
      { condition: condits.isCongratsStep, step: 'congrats' },
      { condition: condits.isSubscriptionStep, step: 'subscription' },
      { condition: condits.isInitializingStep, step: 'initializing' },
      { condition: condits.isOrganizationStep, step: 'organization' },
    ];
    const setupStep = scenarios.find((scenario) => scenario.condition);
    const mapped = {
      ...condits,
      setupStepId: setupStep?.step,
      setupStepIndex: scenarios.indexOf(setupStep) ,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
