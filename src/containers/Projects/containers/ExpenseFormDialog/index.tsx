import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const ExpenseFormeDialogContent = React.lazy(
  () => import('./ExpenseFormDialogContent'),
);

/**
 * Expense form dialog.
 * @returns
 */
function ExpenseFormDialog({
  dialogName,
  payload: { projectId = null },
  isOpen,
}) {
  return (
    <ExpenseFormDialogRoot
      name={dialogName}
      title={<T id={'expenses.dialog.label'} />}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <ExpenseFormeDialogContent
          dialogName={dialogName}
          expense={projectId}
        />
      </DialogSuspense>
    </ExpenseFormDialogRoot>
  );
}

export default compose(withDialogRedux())(ExpenseFormDialog);

const ExpenseFormDialogRoot = styled(Dialog)`
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
    padding-top: 10px;
  }
`;
