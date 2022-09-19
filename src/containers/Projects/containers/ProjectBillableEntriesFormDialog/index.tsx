import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ProjectBillableEntriesFormDialogContent = React.lazy(
  () => import('./ProjectBillableEntriesFormDialogContent'),
);

/**
 * Project billable entries form dialog.
 * @returns
 */
function ProjectBillableEntriesFormDialog({
  dialogName,
  payload: { projectId },
  isOpen,
}) {
  return (
    <ProjectBillableEntriesFormDialogRoot
      name={dialogName}
      title={<T id={'project_billable_entries.dialog.label'} />}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <ProjectBillableEntriesFormDialogContent
          dialogName={dialogName}
          projectId={projectId}
        />
      </DialogSuspense>
    </ProjectBillableEntriesFormDialogRoot>
  );
}

export default compose(withDialogRedux())(ProjectBillableEntriesFormDialog);

const ProjectBillableEntriesFormDialogRoot = styled(Dialog)`
  .bp3-dialog-body {
    .bp3-form-group {
      margin-bottom: 15px;

      label.bp3-label {
        margin-bottom: 3px;
        font-size: 13px;
      }
    }
  }
  .bp3-dialog-footer {
    .bp3-dialog-footer-actions {
      display: flex;
      justify-content: flex-start;
    }
  }
`;
