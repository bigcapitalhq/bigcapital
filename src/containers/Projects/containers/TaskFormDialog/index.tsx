import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Dialog, DialogSuspense, FormattedMessage as T } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const TaskFormDialogContent = React.lazy(
  () => import('./containers/TaskFormDialogContent'),
);

/**
 * Task form dialog.
 * @returns
 */
function TaskFormDialog({ dialogName, payload: { taskId = null }, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={intl.get('task.label.new_task')}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '500px' }}
    >
      <DialogSuspense>
        <TaskFormDialogContent dialogName={dialogName} task={taskId} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(TaskFormDialog);

const TaskFormDialogRoot = styled(Dialog)``;
