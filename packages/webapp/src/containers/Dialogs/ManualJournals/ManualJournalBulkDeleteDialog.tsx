import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithManualJournalsActionsProps } from '@/containers/Accounting/JournalsLanding/withManualJournalsActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withManualJournalsActions } from '@/containers/Accounting/JournalsLanding/withManualJournalsActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { useBulkDeleteManualJournals } from '@/hooks/query/manual-journals';
import { compose } from '@/utils';

interface ManualJournalBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface ManualJournalBulkDeleteDialogProps
  extends WithManualJournalsActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function ManualJournalBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withManualJournalsActions
  resetManualJournalsSelectedRows,

  // #withDialogActions
  closeDialog,
}: ManualJournalBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: ManualJournalBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteManualJournals, isPending: isLoading } =
    useBulkDeleteManualJournals();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteManualJournals({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_journals_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetManualJournalsSelectedRows();
        closeDialog(dialogName);
      })
      .catch(() => {
        AppToaster.show({
          message: intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <Dialog
      title={
        <T
          id={'bulk_delete_dialog_title'}
          values={{
            resourcePlural: intl.get('resource_manual_journal_plural'),
          }}
        />
      }
      isOpen={isOpen}
      onClose={handleCancel}
      canEscapeKeyClose={!isLoading}
      canOutsideClickClose={!isLoading}
    >
      <BulkDeleteDialogContent
        totalSelected={totalSelected}
        deletableCount={deletableCount}
        undeletableCount={undeletableCount}
        resourceSingularLabel={intl.get('resource_manual_journal_singular')}
        resourcePluralLabel={intl.get('resource_manual_journal_plural')}
      />

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCancel} disabled={isLoading}>
            <T id={'cancel'} />
          </Button>

          <Button
            intent={Intent.DANGER}
            onClick={handleConfirmBulkDelete}
            loading={isLoading}
            disabled={deletableCount === 0 || isLoading}
          >
            <T id={'delete_count'} values={{ count: deletableCount }} />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export const ManualJournalBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withManualJournalsActions,
)(ManualJournalBulkDeleteDialogInner);
