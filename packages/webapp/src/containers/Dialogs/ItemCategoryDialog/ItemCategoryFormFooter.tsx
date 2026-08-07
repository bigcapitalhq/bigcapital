import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useItemCategoryContext } from './ItemCategoryProvider';
import type { ItemCategoryFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface ItemCategoryFormFooterProps extends WithDialogActionsProps {}

function ItemCategoryFormFooterInner({
  closeDialog,
}: ItemCategoryFormFooterProps): React.ReactElement {
  const { isNewMode, dialogName } = useItemCategoryContext();
  const { isSubmitting } = useFormikContext<ItemCategoryFormValues>();

  const handleCloseBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button disabled={isSubmitting} onClick={handleCloseBtnClick}>
          <T id={'close'} />
        </Button>

        <Button intent={Intent.PRIMARY} type="submit" loading={isSubmitting}>
          {isNewMode ? <T id={'submit'} /> : <T id={'edit'} />}
        </Button>
      </div>
    </div>
  );
}
export const ItemCategoryFormFooter = compose(withDialogActions)(
  ItemCategoryFormFooterInner,
);
