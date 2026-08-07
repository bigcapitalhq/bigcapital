// @ts-nocheck
import { ProgressBar, Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import React, { useEffect } from 'react';
import { FormattedMessage as T } from '@/components';
import { useJob } from '@/hooks/query';
import { useIsDarkMode } from '@/hooks/useDarkMode';

interface BuildingWorkspaceStepProps {
  jobId?: string;
  onComplete: () => void;
}

export default function BuildingWorkspaceStep({
  jobId,
  onComplete,
}: BuildingWorkspaceStepProps) {
  const isDarkMode = useIsDarkMode();

  const { data: jobState, isFetching: isJobFetching } = useJob(jobId, {
    refetchInterval: 2000,
    enabled: !!jobId,
  });

  const isRunning = jobState?.isRunning;
  const isWaiting = jobState?.isWaiting;
  const isFailed = jobState?.isFailed;
  const isCompleted = jobState?.isCompleted;

  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

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

  if (isFailed) {
    return (
      <x.div textAlign="center" mt={35}>
        <x.h1
          fontSize={'22px'}
          fontWeight={500}
          color={isDarkMode ? 'rgba(255, 255, 255, 0.75)' : '#454c59'}
          mt={0}
          mb={'14px'}
        >
          <T id={'create_workspace.building.failed_title'} />
        </x.h1>
        <x.p
          w="70%"
          mx="auto"
          color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#2e4266'}
        >
          <T id={'create_workspace.building.failed_description'} />
        </x.p>
      </x.div>
    );
  }

  return (
    <x.div w="100%" maxW="700px" mx="auto" pt="80px">
      <x.div className={progressBarStyles}>
        <ProgressBar intent={Intent.NONE} value={null} />
      </x.div>

      <x.div textAlign="center" mt={26}>
        <x.h1
          fontSize={'18px'}
          fontWeight={500}
          color={isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#454c59'}
          mt={0}
          mb={'8px'}
        >
          <T id={'create_workspace.building.title'} />
        </x.h1>
        <x.p
          w="70%"
          mx="auto"
          color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#2e4266'}
        >
          <T id={'create_workspace.building.description'} />
        </x.p>
      </x.div>
    </x.div>
  );
}
