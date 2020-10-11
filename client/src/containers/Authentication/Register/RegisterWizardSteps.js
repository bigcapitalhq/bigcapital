import React from 'react';
import classNames from 'classnames';
import { FormattedMessage as T } from 'react-intl';
import { registerWizardSteps } from 'common/registerWizard'

function RegisterWizardStep({
  label,
  isActive = false
}) {
  return (
    <li className={classNames({ 'is-active': isActive })}>
      <p className={'wizard-info'}><T id={label} /></p>
    </li>
  );
}

function RegisterWizardSteps({
  currentStep = 1,
}) {
  return (
    <div className={'register-wizard-steps'}>
      <div className={'wizard-container'}>
        <ul className={'wizard-wrapper'}>
          {registerWizardSteps.map((step, index) => (
            <RegisterWizardStep
              label={step.label}
              isActive={(index + 1) == currentStep}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RegisterWizardSteps;
