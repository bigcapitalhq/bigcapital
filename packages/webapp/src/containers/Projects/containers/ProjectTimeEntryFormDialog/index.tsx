// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

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
  payload: { timesheetId = null, projectId = null, action },
}) {
  return (
    <ProjectTimeEntryFormDialogRoot
      name={dialogName}
      title={
        action === 'edit' ? (
          <T id={'project_time_entry.dialog.edit_time_entry'} />
        ) : (
          <T id={'project_time_entry.dialog.new_time_entry'} />
        )
      }
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <ProjectTimeEntryFormDialogContent
          dialogName={dialogName}
          timeEntry={timesheetId}
          project={projectId}
        />
      </DialogSuspense>
    </ProjectTimeEntryFormDialogRoot>
  );
}

export default compose(withDialogRedux())(ProjectTimeEntryFormDialog);

const ProjectTimeEntryFormDialogRoot = styled(Dialog)`
  .bp4-dialog-body {
    .bp4-form-group {
      margin-bottom: 0;

      label.bp4-label {
        margin-bottom: 3px;
        font-size: 13px;
      }
    }
    .form-group {
      &--description {
        .bp4-form-content {
          textarea {
            width: 100%;
            min-width: 100%;
            font-size: 14px;
          }
        }
      }
    }
  }
  .bp4-dialog-footer {
    padding-top: 10px;
  }
`;
