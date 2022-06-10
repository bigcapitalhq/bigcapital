import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const TaskDialogContent = React.lazy(() =>
  import('./containers/TaskDialogContent'),
);

/**
 * Task dialog.
 * @returns
 */
function TaskDialog({ dialogName, payload: { taskId = null }, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={'New Task'}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '500px' }}
    >
      <DialogSuspense>
        <TaskDialogContent dialogName={dialogName} task={taskId} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(TaskDialog);

const TaskDialogRoot = styled(Dialog)``;
