import { x } from '@xstyled/emotion';
import React from 'react';
import { SetupWizardContent } from './SetupWizardContent';
import { useCurrentOrganization, useSubscription } from '@/hooks/query';
import { useIsOrganizationSetupCompleted } from '@/hooks/state';

/**
 * Wizard setup right section.
 */
export function SetupRightSection() {
  const { data: organization } = useCurrentOrganization();
  const isOrganizationReady = !!organization?.isReady;
  const isOrganizationBuildRunning = !!organization?.isBuildRunning;
  const isOrganizationSetupCompleted = useIsOrganizationSetupCompleted();
  const { isSubscriptionActive } = useSubscription('main');

  const scenarios = [
    { condition: !isSubscriptionActive, step: 'subscription' },
    {
      condition: !isOrganizationReady && !isOrganizationBuildRunning,
      step: 'organization',
    },
    { condition: isOrganizationBuildRunning, step: 'initializing' },
    { condition: isOrganizationSetupCompleted, step: 'congrats' },
  ];
  const setupStep = scenarios.find((scenario) => scenario.condition);
  const setupStepId = setupStep?.step ?? '';
  const setupStepIndex = setupStep ? scenarios.indexOf(setupStep) : -1;

  return (
    <x.section w="100%" overflow="auto">
      <SetupWizardContent stepId={setupStepId} stepIndex={setupStepIndex} />
    </x.section>
  );
}
