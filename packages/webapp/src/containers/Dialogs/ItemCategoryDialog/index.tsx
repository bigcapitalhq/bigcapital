import React, { lazy } from 'react';
import type { ItemCategoryDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ItemCategoryFormDialogContent = lazy(() =>
  import('./ItemCategoryFormDialogContent').then((m) => ({
    default: m.ItemCategoryFormDialogContent,
  })),
);

interface ItemCategoryFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: ItemCategoryDialogPayload;
}

function ItemCategoryFormDialog({
  dialogName,
  payload = { action: '', id: null },
  isOpen,
}: ItemCategoryFormDialogProps): React.ReactElement {
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
      <DialogSuspense testId={'category-form-dialog'}>
        <ItemCategoryFormDialogContent
          dialogName={dialogName}
          action={payload.action}
          itemCategoryId={payload.id}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(ItemCategoryFormDialog);
