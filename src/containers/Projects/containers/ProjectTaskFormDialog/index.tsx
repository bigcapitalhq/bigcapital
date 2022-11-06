// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ProjectTaskFormDialogContent = React.lazy(
  () => import('./ProjectTaskFormDialogContent'),
);

/**
 * Project task form dialog.
 * @returns
 */
function ProjectTaskFormDialog({
  dialogName,
  payload: { taskId = null, projectId = null, action },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={
        action === 'edit' ? (
          <T id="project_task.dialog.edit_task" />
        ) : (
          <T id={'project_task.dialog.new_task'} />
        )
      }
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '500px' }}
    >
      <DialogSuspense>
        <ProjectTaskFormDialogContent
          dialogName={dialogName}
          task={taskId}
          project={projectId}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(ProjectTaskFormDialog);
