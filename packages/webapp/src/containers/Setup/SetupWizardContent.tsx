import React from 'react';

import SetupSteps from './SetupSteps';
import WizardSetupSteps from './WizardSetupSteps';

import SetupOrganizationPage from './SetupOrganizationPage';
import SetupInitializingForm from './SetupInitializingForm';
import SetupCongratsPage from './SetupCongratsPage';

/**
 * Setup wizard content.
 */
export default function SetupWizardContent({ setupStepIndex, setupStepId }) {
  return (
    <div className="setup-page__content">
      <WizardSetupSteps currentStep={setupStepIndex} />

      <div className="setup-page-form">
        <SetupSteps step={{ id: setupStepId }}>
          <SetupOrganizationPage id="organization" />
          <SetupInitializingForm id={'initializing'} />
          <SetupCongratsPage id="congrats" />
        </SetupSteps>
      </div>
    </div>
  );
}
