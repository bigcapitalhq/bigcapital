// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { getSetupWizardSteps } from '@/constants/registerWizard';

function WizardSetupStep({ label, isActive = false }) {
  return (
    <li className={classNames({ 'is-active': isActive })}>
      <p className={'wizard-info'}>{label}</p>
    </li>
  );
}

/**
 * Setup wizard setups.
 */
export default function WizardSetupSteps({ currentStep = 1 }) {
  const setupWizardSetups = getSetupWizardSteps();

  return (
    <div className={'setup-page-steps-container'}>
      <div className={'setup-page-steps'}>
        <ul>
          {setupWizardSetups.map((step, index) => (
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
