// @ts-nocheck
import { css } from '@emotion/css';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import BuildingWorkspaceStep from './BuildingWorkspaceStep';
import CreateWorkspaceForm from './CreateWorkspaceForm';
import InviteUsersStep from './InviteUsersStep';
import { Stepper } from '@/components/Stepper';

interface CreateWorkspaceStepperProps {
  onClose: () => void;
}

interface CreatedWorkspace {
  organizationId: string;
  jobId: string;
}

const createWorkspaceStepperRootCss = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
`;

const createWorkspaceStepperItemsCss = css`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  flex-shrink: 0;
  padding-top: 24px;
`;

const createWorkspaceStepperContentCss = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  margin-top: 16px;
  margin-bottom: 0;

  > .bp4-drawer-body {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
  > .bp4-navbar {
    flex-shrink: 0;
  }
`;

export function CreateWorkspaceStepper({
  onClose,
}: CreateWorkspaceStepperProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [createdWorkspace, setCreatedWorkspace] =
    useState<CreatedWorkspace | null>(null);

  const handleWorkspaceCreated = (data: CreatedWorkspace) => {
    setCreatedWorkspace(data);
    setStepIndex(1);
  };

  const handleBuildingComplete = () => {
    setStepIndex(2);
  };

  const handleInviteComplete = () => {
    onClose();
  };

  return (
    <Stepper
      active={stepIndex}
      classNames={{
        root: createWorkspaceStepperRootCss,
        items: createWorkspaceStepperItemsCss,
        content: createWorkspaceStepperContentCss,
      }}
    >
      <Stepper.Step label={intl.get('create_workspace.steps.workspace')}>
        <CreateWorkspaceForm
          onSubmitting={handleWorkspaceCreated}
          onCancel={onClose}
        />
      </Stepper.Step>

      <Stepper.Step label={intl.get('create_workspace.steps.building')}>
        <BuildingWorkspaceStep
          jobId={createdWorkspace?.jobId}
          onComplete={handleBuildingComplete}
        />
      </Stepper.Step>

      <Stepper.Step label={intl.get('create_workspace.steps.invite')}>
        <InviteUsersStep
          organizationId={createdWorkspace?.organizationId}
          onComplete={handleInviteComplete}
        />
      </Stepper.Step>
    </Stepper>
  );
}
