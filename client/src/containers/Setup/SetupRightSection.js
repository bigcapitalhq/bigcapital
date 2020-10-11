import React, { useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Wizard, Steps, Step } from 'react-albus';
import { useHistory } from "react-router-dom";
import WizardSetupSteps from './WizardSetupSteps';

import SetupSubscriptionForm from './SetupSubscriptionForm';
import SetupOrganizationForm from './SetupOrganizationForm';

import withAuthentication from 'containers/Authentication/withAuthentication';

import { compose } from 'utils';

/**
 * Wizard setup right section.
 */
function SetupRightSection ({
  isTenantHasSubscriptions: hasSubscriptions = false,
}) {
  const history = useHistory();
  const handleSkip = useCallback(({ step, push }) => {
    const scenarios = [
      { condition: hasSubscriptions, redirectTo: 'organization' },
      { condition: !hasSubscriptions, redirectTo: 'subscription' },
    ];
    const scenario = scenarios.find((scenario) => scenario.condition);

    if (scenario) {
      push(scenario.redirectTo);
    }
  }, [hasSubscriptions]);

  return (
    <section className={'setup-page__right-section'}>
      <Wizard
        onNext={handleSkip}
        basename={'/setup'}
        history={history}
        render={({ step, steps }) => (
          <div>
            <WizardSetupSteps currentStep={steps.indexOf(step) + 1} />

            <TransitionGroup>
              <CSSTransition key={step.id} timeout={{ enter: 500, exit: 500 }}>
                <div class="register-page-form">
                  <Steps key={step.id} step={step}>
                    <Step id="subscription">
                      <SetupSubscriptionForm />
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
  withAuthentication(({ isAuthorized }) => ({ isAuthorized })),
)(SetupRightSection);