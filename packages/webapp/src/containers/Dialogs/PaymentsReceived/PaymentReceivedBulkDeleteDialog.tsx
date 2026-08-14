import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithPaymentsReceivedActionsProps } from '@/containers/Sales/PaymentsReceived/PaymentsLanding/withPaymentsReceivedActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withPaymentsReceivedActions } from '@/containers/Sales/PaymentsReceived/PaymentsLanding/withPaymentsReceivedActions';
import { useBulkDeletePaymentReceives } from '@/hooks/query/payment-receives';
import { compose } from '@/utils';

interface PaymentReceivedBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface PaymentReceivedBulkDeleteDialogProps
  extends WithPaymentsReceivedActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function PaymentReceivedBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withPaymentsReceivedActions
  resetPaymentReceivesSelectedRows,

  // #withDialogActions
  closeDialog,
}: PaymentReceivedBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: PaymentReceivedBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeletePaymentReceives, isPending: isLoading } =
    useBulkDeletePaymentReceives();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeletePaymentReceives({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'the_payments_received_has_been_deleted_successfully',
          ),
          intent: Intent.SUCCESS,
        });
        resetPaymentReceivesSelectedRows();
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
            resourcePlural: intl.get('resource_payment_received_plural'),
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
        resourceSingularLabel={intl.get('resource_payment_received_singular')}
        resourcePluralLabel={intl.get('resource_payment_received_plural')}
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

export const PaymentReceivedBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withPaymentsReceivedActions,
)(PaymentReceivedBulkDeleteDialogInner);
