import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Dialog, DialogSuspense, FormattedMessage as T } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const ProjectTaskFormDialogContent = React.lazy(
  () => import('./ProjectTaskFormDialogContent'),
);

/**
 * Project task form dialog.
 * @returns
 */
function ProjectTaskFormDialog({
  dialogName,
  payload: { taskId = null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={intl.get('project_task.dialog.new_task')}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '500px' }}
    >
      <DialogSuspense>
        <ProjectTaskFormDialogContent dialogName={dialogName} task={taskId} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(ProjectTaskFormDialog);
