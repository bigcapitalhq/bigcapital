import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useWarehouseActivateContext } from './WarehouseActivateFormProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface WarehouseActivateFormFloatingActionsProps
  extends WithDialogActionsProps {}

function WarehouseActivateFormFloatingActionsInner({
  closeDialog,
}: WarehouseActivateFormFloatingActionsProps): React.ReactElement {
  const { dialogName } = useWarehouseActivateContext();
  const { isSubmitting } = useFormikContext<Record<string, never>>();

  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '95px' }}
          type="submit"
        >
          <T id={'warehouses.activate_button'} />
        </Button>
      </div>
    </div>
  );
}
export const WarehouseActivateFormFloatingActions = compose(withDialogActions)(
  WarehouseActivateFormFloatingActionsInner,
);
