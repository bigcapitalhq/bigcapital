import intl from 'react-intl-universal';

export const getSetupWizardSteps = (): Array<{ label: string }> => [
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
