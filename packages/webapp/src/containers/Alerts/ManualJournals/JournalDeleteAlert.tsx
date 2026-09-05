import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { handleDeleteErrors } from './_utils';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeleteJournal } from '@/hooks/query';
import { compose } from '@/utils';

interface JournalDeleteAlertPayload {
  manualJournalId: number;
  journalNumber: string;
}

interface JournalDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: JournalDeleteAlertPayload;
}

/**
 * Journal delete alert.
 */
function JournalDeleteAlertInner({
  name,
  isOpen,
  payload: { manualJournalId, journalNumber },
  closeAlert,
  closeDrawer,
}: JournalDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteJournalMutate, isPending: isLoading } =
    useDeleteJournal();

  const handleCancelAlert = () => {
    closeAlert(name);
  };

  const handleConfirmManualJournalDelete = () => {
    deleteJournalMutate(manualJournalId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_journal_has_been_deleted_successfully', {
            number: journalNumber,
          }),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.JOURNAL_DETAILS);
      })
      .catch(
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          handleDeleteErrors(errors);
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelAlert}
      onConfirm={handleConfirmManualJournalDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_this_journal_you_will_able_to_restore_it'} />
      </p>
    </Alert>
  );
}

export const JournalDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(JournalDeleteAlertInner);
