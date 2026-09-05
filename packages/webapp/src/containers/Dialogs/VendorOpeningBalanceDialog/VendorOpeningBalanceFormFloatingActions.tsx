import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { useVendorOpeningBalanceContext } from './VendorOpeningBalanceFormProvider';
import type { VendorOpeningBalanceFormValues } from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Vendor Opening balance floating actions.
 */
function VendorOpeningBalanceFormFloatingActionsInner({
  closeDialog,
}: WithDialogActionsProps) {
  // dialog context.
  const { dialogName } = useVendorOpeningBalanceContext();

  // Formik context.
  const { isSubmitting } = useFormikContext<VendorOpeningBalanceFormValues>();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '75px' }}
          type="submit"
        >
          {<T id={'edit'} />}
        </Button>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '75px' }}>
          <T id={'cancel'} />
        </Button>
      </div>
    </div>
  );
}
export const VendorOpeningBalanceFormFloatingActions = compose(
  withDialogActions,
)(VendorOpeningBalanceFormFloatingActionsInner);
