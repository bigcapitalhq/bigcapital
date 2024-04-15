// @ts-nocheck
import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const {
      isOrganizationSetupCompleted,
      isOrganizationReady,
      isSubscriptionActive,
      isOrganizationBuildRunning
    } = props;

    const condits = {
      isCongratsStep: isOrganizationSetupCompleted,
      isSubscriptionStep: !isSubscriptionActive,
      isInitializingStep: isOrganizationBuildRunning,
      isOrganizationStep: !isOrganizationReady && !isOrganizationBuildRunning,
    };
    const scenarios = [
      { condition: condits.isSubscriptionStep, step: 'subscription' },
      { condition: condits.isOrganizationStep, step: 'organization' },
      { condition: condits.isInitializingStep, step: 'initializing' },
      { condition: condits.isCongratsStep, step: 'congrats' },
    ];
    const setupStep = scenarios.find((scenario) => scenario.condition);
    const mapped = {
      ...condits,
      setupStepId: setupStep?.step,
      setupStepIndex: scenarios.indexOf(setupStep),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
