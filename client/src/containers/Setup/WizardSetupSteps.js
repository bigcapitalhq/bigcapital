import React from 'react';
import classNames from 'classnames';
import { FormattedMessage as T } from 'components';
import { registerWizardSteps } from 'common/registerWizard';

function WizardSetupStep({ label, isActive = false }) {
  return (
    <li className={classNames({ 'is-active': isActive })}>
      <p className={'wizard-info'}>
        <T id={label} />
      </p>
    </li>
  );
}

export default function WizardSetupSteps({ currentStep = 1 }) {
  return (
    <div className={'setup-page-steps-container'}>
      <div className={'setup-page-steps'}>
        <ul>
          {registerWizardSteps.map((step, index) => (
            <WizardSetupStep
              label={step.label}
              isActive={index + 1 === currentStep}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
