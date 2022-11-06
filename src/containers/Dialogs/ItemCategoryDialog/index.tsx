// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';

import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ItemCategoryFormDialogContent = lazy(() =>
  import('./ItemCategoryFormDialogContent'),
);

/**
 * Item Category form dialog.
 */
function ItemCategoryFormDialog({
  dialogName,
  payload = { action: '', id: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={
        payload.action === 'edit' ? (
          <T id={'edit_category'} />
        ) : (
          <T id={'new_category'} />
        )
      }
      className={'dialog--category-form'}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
    >
      <DialogSuspense>
        <ItemCategoryFormDialogContent
          dialogName={dialogName}
          action={payload.action}
          itemCategoryId={payload.id}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(ItemCategoryFormDialog);
