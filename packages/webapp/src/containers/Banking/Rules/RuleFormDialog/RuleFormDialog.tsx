// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const RuleFormContent = React.lazy(() => import('./RuleFormContent'));

/**
 * Payment mail dialog.
 */
function RuleFormDialogRoot({
  dialogName,
  payload: { bankRuleId = null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={bankRuleId ? 'Edit Bank Rule' : 'New Bank Rule'}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ width: 600 }}
    >
      <DialogSuspense>
        <RuleFormContent dialogName={dialogName} bankRuleId={bankRuleId} />
      </DialogSuspense>
    </Dialog>
  );
}

export const RuleFormDialog = compose(withDialogRedux())(RuleFormDialogRoot);

RuleFormDialog.displayName = 'RuleFormDialog';
