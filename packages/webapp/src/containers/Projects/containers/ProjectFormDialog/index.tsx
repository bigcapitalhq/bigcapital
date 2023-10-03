// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ProjectDialogContent = React.lazy(
  () => import('./ProjectFormDialogContent'),
);

/**
 * Project form dialog.
 * @returns
 */
function ProjectFormDialog({
  dialogName,
  payload: { projectId = null, action },
  isOpen,
}) {
  return (
    <ProjectFormDialogRoot
      name={dialogName}
      title={
        action === 'edit' ? (
          <T id="projects.dialog.edit_project" />
        ) : (
          <T id={'projects.dialog.new_project'} />
        )
      }
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <ProjectDialogContent dialogName={dialogName} project={projectId} />
      </DialogSuspense>
    </ProjectFormDialogRoot>
  );
}

export default compose(withDialogRedux())(ProjectFormDialog);

const ProjectFormDialogRoot = styled(Dialog)`
  .bp4-dialog-body {
    .bp4-form-group {
      margin-bottom: 0;

      label.bp4-label {
        margin-bottom: 3px;
        font-size: 13px;
      }
    }
  }
  .bp4-dialog-footer {
    padding-top: 10px;
  }
`;
