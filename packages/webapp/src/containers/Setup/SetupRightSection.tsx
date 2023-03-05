// @ts-nocheck
import React from 'react';

import SetupDialogs from './SetupDialogs';
import SetupWizardContent from './SetupWizardContent';

import withOrganization from '@/containers/Organization/withOrganization';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import withSetupWizard from '@/store/organizations/withSetupWizard';

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
}) {
  return (
    <section className={'setup-page__right-section'}>
      <SetupWizardContent
        setupStepId={setupStepId}
        setupStepIndex={setupStepIndex}
      />
      <SetupDialogs />
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
  withSetupWizard(({ setupStepId, setupStepIndex }) => ({
    setupStepId,
    setupStepIndex,
  })),
)(SetupRightSection);
