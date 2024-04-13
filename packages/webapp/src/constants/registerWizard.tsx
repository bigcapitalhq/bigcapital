// @ts-nocheck
import intl from 'react-intl-universal';

export const getSetupWizardSteps = () => [
  {
    label: intl.get('setup.plan.plans'),
  },
  {
    label: intl.get('setup.plan.getting_started'),
  },
  {
    label: intl.get('setup.plan.initializing'),
  },
  {
    label: intl.get('setup.plan.congrats'),
  },
];