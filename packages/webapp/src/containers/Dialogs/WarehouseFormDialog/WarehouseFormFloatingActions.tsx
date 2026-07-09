import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useWarehouseFormContext } from './WarehouseFormProvider';
import type { WarehouseFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface WarehouseFormFloatingActionsProps extends WithDialogActionsProps {}

function WarehouseFormFloatingActionsInner({
  closeDialog,
}: WarehouseFormFloatingActionsProps): React.ReactElement {
  const { isSubmitting } = useFormikContext<WarehouseFormValues>();
  const { dialogName } = useWarehouseFormContext();

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
          <T id={'save'} />
        </Button>
      </div>
    </div>
  );
}

export const WarehouseFormFloatingActions = compose(withDialogActions)(
  WarehouseFormFloatingActionsInner,
);
