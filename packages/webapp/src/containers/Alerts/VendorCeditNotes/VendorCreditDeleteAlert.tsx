import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { handleDeleteErrors } from '@/containers/Purchases/CreditNotes/CreditNotesLanding/utils';
import { useDeleteVendorCredit } from '@/hooks/query';
import { compose } from '@/utils';

interface VendorCreditDeleteAlertPayload {
  vendorCreditId: number;
}

interface VendorCreditDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: VendorCreditDeleteAlertPayload;
}

/**
 * Vendor Credit delete alert.
 */
function VendorCreditDeleteAlertInner({
  name,
  isOpen,
  payload: { vendorCreditId },
  closeAlert,
  closeDrawer,
}: VendorCreditDeleteAlertProps): React.ReactElement {
  const { isPending: isLoading, mutateAsync: deleteVendorCreditMutate } =
    useDeleteVendorCredit();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmCreditDelete = () => {
    deleteVendorCreditMutate(vendorCreditId)
      .then(() => {
        AppToaster.show({
          message: intl.get('vendor_credits.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.VENDOR_CREDIT_DETAILS);
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
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmCreditDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={'vendor_credits.note.once_delete_this_vendor_credit_note'}
        />
      </p>
    </Alert>
  );
}

export const VendorCreditDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(VendorCreditDeleteAlertInner);
