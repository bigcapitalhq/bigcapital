// @ts-nocheck
import React from 'react';
import { ProgressBar, Intent } from '@blueprintjs/core';
import * as R from 'ramda';

import { useJob, useCurrentOrganization } from '@/hooks/query';
import { FormattedMessage as T } from '@/components';

import withOrganizationActions from '@/containers/Organization/withOrganizationActions';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import withOrganization from '../Organization/withOrganization';

import '@/style/pages/Setup/Initializing.scss';

/**
 * Setup initializing step form.
 */
function SetupInitializingForm({
  setOrganizationSetupCompleted,
  organization,
}) {
  const { refetch, isSuccess } = useCurrentOrganization({ enabled: false });

  // Job done state.
  const [isJobDone, setIsJobDone] = React.useState(false);

  const {
    data: { running, queued, failed, completed },
    isFetching: isJobFetching,
  } = useJob(organization?.build_job_id, {
    refetchInterval: 2000,
    enabled: !!organization?.build_job_id,
  });

  React.useEffect(() => {
    if (completed) {
      refetch();
      setIsJobDone(true);
    }
  }, [refetch, completed, setOrganizationSetupCompleted]);

  React.useEffect(() => {
    if (isSuccess && isJobDone) {
      setOrganizationSetupCompleted(true);
      setIsJobDone(false);
    }
  }, [setOrganizationSetupCompleted, isJobDone, isSuccess]);

  return (
    <div class="setup-initializing-form">
      {failed ? (
        <SetupInitializingFailed />
      ) : running || queued || isJobFetching ? (
        <SetupInitializingRunning />
      ) : completed ? (
        <SetupInitializingCompleted />
      ) : (
        <SetupInitializingFailed />
      )}
    </div>
  );
}

export default R.compose(
  withOrganizationActions,
  withCurrentOrganization(({ organizationTenantId }) => ({
    organizationId: organizationTenantId,
  })),
  withOrganization(({ organization }) => ({ organization })),
)(SetupInitializingForm);

/**
 * State initializing failed state.
 */
function SetupInitializingFailed() {
  return (
    <div class="setup-initializing__content">
      <div className={'setup-initializing-form__title'}>
        <h1>
          <T id={'setup.initializing.something_went_wrong'} />
        </h1>
        <p class="paragraph">
          <T id={'setup.initializing.please_refresh_the_page'} />
        </p>
      </div>
    </div>
  );
}

/**
 * Setup initializing running state.
 */
function SetupInitializingRunning() {
  return (
    <div class="setup-initializing__content">
      <ProgressBar intent={Intent.PRIMARY} value={null} />

      <div className={'setup-initializing-form__title'}>
        <h1>
          <T id={'setup.initializing.title'} />
        </h1>
        <p className={'paragraph'}>
          <T id={'setup.initializing.description'} />
        </p>
      </div>
    </div>
  );
}

/**
 * Setup initializing completed state.
 */
function SetupInitializingCompleted() {
  return (
    <div class="setup-initializing__content">
      <div className={'setup-initializing-form__title'}>
        <h1>
          <T id={'setup.initializing.waiting_to_redirect'} />
        </h1>
        <p class="paragraph">
          <T
            id={'setup.initializing.refresh_the_page_if_redirect_not_worked'}
          />
        </p>
      </div>
    </div>
  );
}
