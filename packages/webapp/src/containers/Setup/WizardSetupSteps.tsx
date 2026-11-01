import classNames from 'classnames';
import { getSetupWizardSteps } from '@/constants/registerWizard';

function WizardSetupStep({
  label,
  isActive = false,
}: {
  label: string;
  isActive?: boolean;
}) {
  return (
    <li className={classNames({ 'is-active': isActive })}>
      <p className={'wizard-info'}>{label}</p>
    </li>
  );
}

/**
 * Setup wizard setups.
 */
export function WizardSetupSteps({
  currentStep = 1,
}: {
  currentStep?: number;
}) {
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
