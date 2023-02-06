// @ts-nocheck
import React from 'react';
import { Classes, Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { useFormikContext } from 'formik';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { useItemCategoryContext } from './ItemCategoryProvider';

import { compose } from '@/utils';

/**
 * Item category form footer.
 */
function ItemCategoryFormFooter({
  // #withDialogActions
  closeDialog,
}) {
  // Item category context.
  const { isNewMode, dialogName } = useItemCategoryContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle close button click.
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
export default compose(withDialogActions)(ItemCategoryFormFooter);
