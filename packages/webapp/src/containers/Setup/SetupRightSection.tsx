// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';

import { SetupWizardContent } from './SetupWizardContent';

import { withOrganization } from '@/containers/Organization/withOrganization';
import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';
import { withSetupWizard } from '@/store/organizations/with-setup-wizard';
import { withSubscriptions } from '../Subscriptions/withSubscriptions';
import { flow } from 'fp-ts/function';

/**
 * Wizard setup right section.
 */
function SetupRightSectionInner({
  // #withOrganization
  isOrganizationInitialized,
  isOrganizationSeeded,
  isOrganizationSetupCompleted,

  // #withSetupWizard
  setupStepId,
  setupStepIndex,

  // #withSubscriptions
  isSubscriptionActive,
}) {
  return (
    <x.section w="100%" overflow="auto">
      <SetupWizardContent stepId={setupStepId} stepIndex={setupStepIndex} />
    </x.section>
  );
}

export const SetupRightSection = flow(
  withSetupWizard(({ setupStepId, setupStepIndex }) => ({
    setupStepId,
    setupStepIndex,
  })),
  withSubscriptions(
    ({ isSubscriptionActive }) => ({
      isSubscriptionActive,
    }),
    'main',
  ),
  withOrganization(
    ({
      organization,
      isOrganizationReady,
      isOrganizationSeeded,
      isOrganizationSetupCompleted,
      isOrganizationBuildRunning,
    }) => ({
      organization,
      isOrganizationReady,
      isOrganizationSeeded,
      isOrganizationSetupCompleted,
      isOrganizationBuildRunning,
    }),
  ),
  withCurrentOrganization(({ organizationTenantId }) => ({
    organizationId: organizationTenantId,
  })),
)(SetupRightSectionInner);
