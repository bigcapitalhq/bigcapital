// @ts-nocheck
import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const {
      isOrganizationSetupCompleted,
      isOrganizationReady,
      isOrganizationBuildRunning
    } = props;

    const condits = {
      isCongratsStep: isOrganizationSetupCompleted,
      isInitializingStep: isOrganizationBuildRunning,
      isOrganizationStep: !isOrganizationReady && !isOrganizationBuildRunning,
    };
    const scenarios = [
      { condition: condits.isOrganizationStep, step: 'organization' },
      { condition: condits.isInitializingStep, step: 'initializing' },
      { condition: condits.isCongratsStep, step: 'congrats' },
    ];
    const setupStep = scenarios.find((scenario) => scenario.condition);
    const mapped = {
      ...condits,
      setupStepId: setupStep?.step,
      setupStepIndex: scenarios.indexOf(setupStep) + 1,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
