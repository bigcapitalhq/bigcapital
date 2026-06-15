// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const EstimatedExpenseFormDialogContent = React.lazy(() =>
  import('./EstimatedExpenseFormDialogContent').then((m) => ({
    default: m.EstimatedExpenseFormDialogContent,
  })),
);

/**
 * Estimate expense form dialog.
 * @returns
 */
function EstimatedExpenseFormDialog({
  dialogName,
  payload: { projectId = null },
  isOpen,
}) {
  return (
    <EstimateExpenseFormDialogRoot
      name={dialogName}
      title={<T id={'estimated_expenses.dialog.label'} />}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <EstimatedExpenseFormDialogContent
          dialogName={dialogName}
          estimatedExpense={projectId}
        />
      </DialogSuspense>
    </EstimateExpenseFormDialogRoot>
  );
}

export const index = flow(withDialogRedux())(
  EstimatedExpenseFormDialog,
);

const EstimateExpenseFormDialogRoot = styled(Dialog)`
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
