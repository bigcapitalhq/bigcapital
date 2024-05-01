// @ts-nocheck
import React from 'react';

import SetupWizardContent from './SetupWizardContent';

import withOrganization from '@/containers/Organization/withOrganization';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import withSetupWizard from '@/store/organizations/withSetupWizard';
import withSubscriptions from '../Subscriptions/withSubscriptions';

import { compose } from '@/utils';

/**
 * Wizard setup right section.
 */
function SetupRightSection({
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
    <section className={'setup-page__right-section'}>
      <SetupWizardContent stepId={setupStepId} stepIndex={setupStepIndex} />
    </section>
  );
}

export default compose(
  withCurrentOrganization(({ organizationTenantId }) => ({
    organizationId: organizationTenantId,
  })),
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
  withSubscriptions(
    ({ isSubscriptionActive }) => ({
      isSubscriptionActive,
    }),
    'main',
  ),
  withSetupWizard(({ setupStepId, setupStepIndex }) => ({
    setupStepId,
    setupStepIndex,
  })),
)(SetupRightSection);
