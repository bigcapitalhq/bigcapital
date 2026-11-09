import React from 'react';
import { ItemCategoryForm } from './ItemCategoryForm';
import { ItemCategoryProvider } from './ItemCategoryProvider';

interface ItemCategoryFormDialogContentProps {
  itemCategoryId?: number | null;
  dialogName: string;
  action?: string;
}

export function ItemCategoryFormDialogContent({
  itemCategoryId,
  dialogName,
}: ItemCategoryFormDialogContentProps): React.ReactElement {
  return (
    <ItemCategoryProvider
      itemCategoryId={itemCategoryId}
      dialogName={dialogName}
    >
      <ItemCategoryForm />
    </ItemCategoryProvider>
  );
}
