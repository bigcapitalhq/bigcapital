import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithCreditNotesActionsProps } from '@/containers/Sales/CreditNotes/CreditNotesLanding/withCreditNotesActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withCreditNotesActions } from '@/containers/Sales/CreditNotes/CreditNotesLanding/withCreditNotesActions';
import { useBulkDeleteCreditNotes } from '@/hooks/query/credit-note';
import { compose } from '@/utils';

interface CreditNoteBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface CreditNoteBulkDeleteDialogProps
  extends WithCreditNotesActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function CreditNoteBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withCreditNotesActions
  resetCreditNotesSelectedRows,

  // #withDialogActions
  closeDialog,
}: CreditNoteBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: CreditNoteBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteCreditNotes, isPending: isLoading } =
    useBulkDeleteCreditNotes();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteCreditNotes({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_credit_notes_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetCreditNotesSelectedRows();
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
          values={{ resourcePlural: intl.get('resource_credit_note_plural') }}
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
        resourceSingularLabel={intl.get('resource_credit_note_singular')}
        resourcePluralLabel={intl.get('resource_credit_note_plural')}
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

export const CreditNoteBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withCreditNotesActions,
)(CreditNoteBulkDeleteDialogInner);
