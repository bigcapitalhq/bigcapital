// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';
import { css } from '@emotion/css';

import SetupSubscription from './SetupSubscription/SetupSubscription';
import SetupOrganizationPage from './SetupOrganizationPage';
import SetupInitializingForm from './SetupInitializingForm';
import SetupCongratsPage from './SetupCongratsPage';
import { Stepper } from '@/components/Stepper';

interface SetupWizardContentProps {
  stepIndex: number;
  stepId: string;
}

const itemsClassName = css`
  padding: 40px 40px 20px;
`;

/**
 * Setup wizard content.
 */
export default function SetupWizardContent({
  stepIndex,
  stepId,
}: SetupWizardContentProps) {
  return (
    <x.div w="100%" overflow="auto">
      <Stepper
        active={stepIndex}
        classNames={{
          items: itemsClassName,
        }}
      >
        <Stepper.Step label={'Subscription'}>
          <SetupSubscription />
        </Stepper.Step>

        <Stepper.Step label={'Organization'}>
          <SetupOrganizationPage id="organization" />
        </Stepper.Step>

        <Stepper.Step label={'Initializing'}>
          <SetupInitializingForm id={'initializing'} />
        </Stepper.Step>

        <Stepper.Step label={'Congrats'}>
          <SetupCongratsPage id="congrats" />
        </Stepper.Step>
      </Stepper>
    </x.div>
  );
}
