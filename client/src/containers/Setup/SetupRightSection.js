import React from 'react';

import { Wizard } from 'react-albus';
import { useHistory } from 'react-router-dom';

import withSubscriptions from 'containers/Subscriptions/withSubscriptions';

import SetupDialogs from './SetupDialogs';
import SetupWizardContent from './SetupWizardContent';

import withOrganization from 'containers/Organization/withOrganization';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import withSetupWizard from '../../store/organizations/withSetupWizard';

import { compose } from 'utils';

/**
 * Wizard setup right section.
 */
function SetupRightSection({
  // #withOrganization
  isOrganizationInitialized,
  isOrganizationSeeded,
  isOrganizationSetupCompleted,

  // #withSetupWizard
  isCongratsStep,
  isSubscriptionStep,
  isInitializingStep,
  isOrganizationStep,

  // #withSubscriptions
  isSubscriptionActive,
}) {
  const history = useHistory();

  const handleSkip = ({ step, push }) => {
    const scenarios = [
      { condition: isCongratsStep, redirectTo: 'congrats' },
      { condition: isSubscriptionStep, redirectTo: 'subscription' },
      { condition: isInitializingStep, redirectTo: 'initializing' },
      { condition: isOrganizationStep, redirectTo: 'organization' },
    ];
    const scenario = scenarios.find((scenario) => scenario.condition);

    if (scenario) {
      push(scenario.redirectTo);
    }
  };

  return (
    <section className={'setup-page__right-section'}>
      <Wizard
        onNext={handleSkip}
        basename={'/setup'}
        history={history}
        render={SetupWizardContent}
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
      isOrganizationInitialized,
      isOrganizationSeeded,
      isOrganizationSetupCompleted,
    }) => ({
      organization,
      isOrganizationInitialized,
      isOrganizationSeeded,
      isOrganizationSetupCompleted,
    }),
  ),
  withSubscriptions(
    ({ isSubscriptionActive }) => ({
      isSubscriptionActive,
    }),
    'main',
  ),
  withSetupWizard(
    ({
      isCongratsStep,
      isSubscriptionStep,
      isInitializingStep,
      isOrganizationStep,
    }) => ({
      isCongratsStep,
      isSubscriptionStep,
      isInitializingStep,
      isOrganizationStep,
    }),
  ),
)(SetupRightSection);
