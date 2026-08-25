import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithPaymentMadeActionsProps } from '@/containers/Purchases/PaymentsMade/PaymentsLanding/withPaymentMadeActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withPaymentMadeActions } from '@/containers/Purchases/PaymentsMade/PaymentsLanding/withPaymentMadeActions';
import { useBulkDeletePaymentMades } from '@/hooks/query/payment-mades';
import { compose } from '@/utils';

interface PaymentMadeBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface PaymentMadeBulkDeleteDialogProps
  extends WithPaymentMadeActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function PaymentMadeBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withPaymentMadeActions
  resetPaymentMadesSelectedRows,

  // #withDialogActions
  closeDialog,
}: PaymentMadeBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: PaymentMadeBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeletePaymentMades, isPending: isLoading } =
    useBulkDeletePaymentMades();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeletePaymentMades({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_payments_made_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetPaymentMadesSelectedRows();
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
            resourcePlural: intl.get('resource_payment_made_plural'),
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
        resourceSingularLabel={intl.get('resource_payment_made_singular')}
        resourcePluralLabel={intl.get('resource_payment_made_plural')}
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

export const PaymentMadeBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withPaymentMadeActions,
)(PaymentMadeBulkDeleteDialogInner);
