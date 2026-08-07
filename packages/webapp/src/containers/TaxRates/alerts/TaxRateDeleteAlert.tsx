import { Intent, Alert } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withAlertStoreConnect,
  WithAlertStoreConnectProps,
} from '@/containers/Alert/withAlertStoreConnect';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { useDeleteTaxRate } from '@/hooks/query/tax-rates';
import { compose } from '@/utils';

interface TaxRateDeleteAlertInnerProps
  extends Pick<WithAlertStoreConnectProps, 'isOpen'>,
    Pick<WithAlertActionsProps, 'closeAlert'>,
    Pick<WithDrawerActionsProps, 'closeDrawer'> {
  name: string;
  payload: { taxRateId: number };
}

/**
 * Item delete alerts.
 */
function TaxRateDeleteAlertInner({
  name,
  isOpen,
  payload: { taxRateId },
  closeAlert,
  closeDrawer,
}: TaxRateDeleteAlertInnerProps) {
  const { mutateAsync: deleteTaxRate, isPending } = useDeleteTaxRate();

  // Handle cancel delete item alert.
  const handleCancelItemDelete = () => {
    closeAlert(name);
  };
  // Handle confirm delete item.
  const handleConfirmDeleteItem = () => {
    deleteTaxRate(taxRateId)
      .then(() => {
        AppToaster.show({
          message: 'The tax rate has been deleted successfully.',
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.TAX_RATE_DETAILS);
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      })
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
      onCancel={handleCancelItemDelete}
      onConfirm={handleConfirmDeleteItem}
      loading={isPending}
    >
      <p>
        Once you delete this tax rate, you won't be able to restore the item
        later.
      </p>

      <p>
        Are you sure you want to delete ? If you're not sure, you can inactivate
        it instead.
      </p>
    </Alert>
  );
}

export const TaxRateDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(TaxRateDeleteAlertInner);
