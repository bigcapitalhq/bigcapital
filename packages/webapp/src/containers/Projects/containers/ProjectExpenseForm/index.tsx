// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ProjectExpenseFormeDialogContent = React.lazy(
  () => import('./ProjectExpenseFormDialogContent'),
);

/**
 * Project expense form dialog.
 * @returns
 */
function ProjectExpenseFormDialog({
  dialogName,
  payload: { projectId = null },
  isOpen,
}) {
  return (
    <ProjectExpenseFormDialogRoot
      name={dialogName}
      title={<T id={'project_expense.dialog.label'} />}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <ProjectExpenseFormeDialogContent
          dialogName={dialogName}
          expense={projectId}
        />
      </DialogSuspense>
    </ProjectExpenseFormDialogRoot>
  );
}

export default compose(withDialogRedux())(ProjectExpenseFormDialog);

const ProjectExpenseFormDialogRoot = styled(Dialog)`
  .bp4-dialog-body {
    .bp4-form-group {
      margin-bottom: 15px;

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
