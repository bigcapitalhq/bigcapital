import React from 'react';
import { Steps, Step } from 'react-albus';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import WizardSetupSteps from './WizardSetupSteps';

import SetupSubscription from './SetupSubscription';
import SetupOrganizationPage from './SetupOrganizationPage';
import SetupInitializingForm from './SetupInitializingForm';
import SetupCongratsPage from './SetupCongratsPage';

/**
 * Setup wizard content.
 */
export default function SetupWizardContent({
  step,
  steps
}) {
  return (
    <div class="setup-page__content">
      <WizardSetupSteps currentStep={steps.indexOf(step) + 1} />

      <TransitionGroup>
        <CSSTransition key={step.id} timeout={{ enter: 500, exit: 500 }}>
          <div class="setup-page-form">
            <Steps key={step.id} step={step}>
              <Step id="subscription">
                <SetupSubscription />
              </Step>

              <Step id={'initializing'}>
                <SetupInitializingForm />
              </Step>

              <Step id="organization">
                <SetupOrganizationPage />
              </Step>

              <Step id="congrats">
                <SetupCongratsPage />
              </Step>
            </Steps>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}
