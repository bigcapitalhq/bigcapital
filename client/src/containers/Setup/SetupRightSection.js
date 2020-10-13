import React, { useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Wizard, Steps, Step } from 'react-albus';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';

import WizardSetupSteps from './WizardSetupSteps';

import SetupSubscriptionForm from './SetupSubscriptionForm';
import SetupOrganizationForm from './SetupOrganizationForm';
import SetupInitializingForm from './SetupInitializingForm';

import withAuthentication from 'containers/Authentication/withAuthentication';
import withOrganization from 'containers/Organization/withOrganization'
import { compose } from 'utils';

/**
 * Wizard setup right section.
 */
function SetupRightSection ({
  // #withAuthentication
  currentOrganizationId,

  // #withOrganization
  isOrganizationInitialized,
  isOrganizationSubscribed: hasSubscriptions,
  isOrganizationSeeded
}) {
  const history = useHistory();

  const handleSkip = useCallback(({ step, push }) => {
    const scenarios = [
      { condition: !hasSubscriptions, redirectTo: 'subscription' },
      { condition: hasSubscriptions && !isOrganizationInitialized, redirectTo: 'initializing' },
      { condition: hasSubscriptions && !isOrganizationSeeded, redirectTo: 'organization' },
    ];
    const scenario = scenarios.find((scenario) => scenario.condition);

    if (scenario) {
      push(scenario.redirectTo);
    }
  }, [
    hasSubscriptions,
    isOrganizationInitialized,
    isOrganizationSeeded,
  ]);

  return (
    <section className={'setup-page__right-section'}>
      <Wizard
        onNext={handleSkip}
        basename={'/setup'}
        history={history}
        render={({ step, steps }) => (
          <div class="setup-page__content">
            <WizardSetupSteps currentStep={steps.indexOf(step) + 1} />

            <TransitionGroup>
              <CSSTransition key={step.id} timeout={{ enter: 500, exit: 500 }}>
                <div class="register-page-form">
                  <Steps key={step.id} step={step}>
                    <Step id="subscription">
                      <SetupSubscriptionForm />
                    </Step>

                    <Step id={'initializing'}>
                      <SetupInitializingForm />
                    </Step>

                    <Step id="organization">
                      <SetupOrganizationForm />
                    </Step>

                    <Step id="congratulations">
                      <h1 className="text-align-center">Ice King</h1>
                    </Step>
                  </Steps>
                </div>
              </CSSTransition>
            </TransitionGroup>
        </div>
      )} />
    </section>
  )
}

export default compose(
  withAuthentication(({ currentOrganizationId }) => ({ currentOrganizationId })),
  connect((state, props) => ({
    organizationId: props.currentOrganizationId,
  })),
  withOrganization(({
    organization,
    isOrganizationInitialized,
    isOrganizationSubscribed,
    isOrganizationSeeded,
  }) => ({
    organization,
    isOrganizationInitialized,
    isOrganizationSubscribed,
    isOrganizationSeeded,
  })),
)(SetupRightSection);