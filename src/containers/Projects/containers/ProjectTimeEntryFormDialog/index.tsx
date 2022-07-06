import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const ProjectTimeEntryFormDialogContent = React.lazy(
  () => import('./ProjectTimeEntryFormDialogContent'),
);

/**
 * Project time entry form dialog.
 * @returns
 */
function ProjectTimeEntryFormDialog({
  dialogName,
  isOpen,
  payload: { projectId = null, timeEntryId = null },
}) {
  return (
    <ProjectTimeEntryFormDialogRoot
      name={dialogName}
      title={<T id={'project_time_entry.dialog.label'} />}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <ProjectTimeEntryFormDialogContent
          dialogName={dialogName}
          project={projectId}
          timeEntry={timeEntryId}
        />
      </DialogSuspense>
    </ProjectTimeEntryFormDialogRoot>
  );
}

export default compose(withDialogRedux())(ProjectTimeEntryFormDialog);

const ProjectTimeEntryFormDialogRoot = styled(Dialog)`
  .bp3-dialog-body {
    .bp3-form-group {
      margin-bottom: 15px;

      label.bp3-label {
        margin-bottom: 3px;
        font-size: 13px;
      }
    }
    .form-group {
      &--description {
        .bp3-form-content {
          textarea {
            width: 100%;
            min-width: 100%;
            font-size: 14px;
          }
        }
      }
    }
  }
  .bp3-dialog-footer {
    padding-top: 10px;
  }
`;
