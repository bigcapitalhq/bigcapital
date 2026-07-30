// @ts-nocheck
import { ProgressBar, Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import React, { useEffect } from 'react';
import { FormattedMessage as T } from '@/components';
import { withOrganizationActions } from '@/containers/Organization/withOrganizationActions';
import { useJob, useCurrentOrganization } from '@/hooks/query';
import { useIsDarkMode } from '@/hooks/useDarkMode';

/**
 * Setup initializing step form.
 */
function SetupInitializingFormInner({ setOrganizationSetupCompleted }) {
  const {
    data: organization,
    refetch,
    isSuccess,
  } = useCurrentOrganization({ enabled: false });

  // Job done state.
  const [isJobDone, setIsJobDone] = React.useState(false);

  const { data: jobState, isFetching: isJobFetching } = useJob(
    organization?.buildJobId,
    {
      refetchInterval: 2000,
      enabled: !!organization?.buildJobId,
    },
  );
  const isRunning = Boolean(jobState?.isRunning);
  const isWaiting = Boolean(jobState?.isWaiting);
  const isFailed = Boolean(jobState?.isFailed);
  const isCompleted = Boolean(jobState?.isCompleted);

  useEffect(() => {
    if (isCompleted) {
      refetch();
      setIsJobDone(true);
    }
  }, [refetch, isCompleted, setOrganizationSetupCompleted]);

  useEffect(() => {
    if (isSuccess && isJobDone) {
      setOrganizationSetupCompleted(true);
      setIsJobDone(false);
    }
  }, [setOrganizationSetupCompleted, isJobDone, isSuccess]);

  return (
    <x.div w="95%" mx="auto" pt="16%">
      {isFailed ? (
        <SetupInitializingFailed />
      ) : isRunning || isWaiting || isJobFetching ? (
        <SetupInitializingRunning />
      ) : isCompleted ? (
        <SetupInitializingCompleted />
      ) : (
        <SetupInitializingFailed />
      )}
    </x.div>
  );
}

export const SetupInitializingForm = withOrganizationActions(
  SetupInitializingFormInner,
);

/**
 * State initializing failed state.
 */
function SetupInitializingFailed() {
  const isDarkMode = useIsDarkMode();

  return (
    <x.div>
      <x.div textAlign="center" mt={35}>
        <x.h1
          fontSize={'22px'}
          fontWeight={500}
          color={isDarkMode ? 'rgba(255, 255, 255, 0.75)' : '#454c59'}
          mt={0}
          mb={'14px'}
        >
          <T id={'setup.initializing.something_went_wrong'} />
        </x.h1>
        <x.p
          w="70%"
          mx="auto"
          color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#2e4266'}
        >
          <T id={'setup.initializing.please_refresh_the_page'} />
        </x.p>
      </x.div>
    </x.div>
  );
}

/**
 * Setup initializing running state.
 */
function SetupInitializingRunning() {
  const isDarkMode = useIsDarkMode();

  const progressBarStyles = css`
    .bp4-progress-bar {
      border-radius: 40px;
      display: block;
      height: 6px;
      overflow: hidden;
      position: relative;
      width: 80%;
      margin: 0 auto;

      .bp4-progress-meter {
        background-color: #809cb3;
      }
    }
  `;

  return (
    <x.div>
      <x.div className={progressBarStyles}>
        <ProgressBar intent={Intent.NONE} value={null} />
      </x.div>

      <x.div textAlign="center" mt={35}>
        <x.h1
          fontSize={'22px'}
          fontWeight={500}
          color={isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#454c59'}
          mt={0}
          mb={'14px'}
        >
          <T id={'setup.initializing.title'} />
        </x.h1>
        <x.p
          w="70%"
          mx="auto"
          color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#2e4266'}
        >
          <T id={'setup.initializing.description'} />
        </x.p>
      </x.div>
    </x.div>
  );
}

/**
 * Setup initializing completed state.
 */
function SetupInitializingCompleted() {
  const isDarkMode = useIsDarkMode();

  return (
    <x.div>
      <x.div textAlign="center" mt={35}>
        <x.h1
          fontSize={'22px'}
          fontWeight={600}
          color={isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#454c59'}
          mt={0}
          mb={'14px'}
        >
          <T id={'setup.initializing.waiting_to_redirect'} />
        </x.h1>
        <x.p
          w="70%"
          mx="auto"
          color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#2e4266'}
        >
          <T
            id={'setup.initializing.refresh_the_page_if_redirect_not_worked'}
          />
        </x.p>
      </x.div>
    </x.div>
  );
}
