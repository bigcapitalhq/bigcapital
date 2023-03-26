// @ts-nocheck
import React from 'react';
import { ItemCategoryProvider } from './ItemCategoryProvider';
import ItemCategoryForm from './ItemCategoryForm';

import '@/style/pages/ItemCategory/ItemCategoryDialog.scss';

/**
 * Item Category form dialog content.
 */
export default function ItemCategoryFormDialogContent({
  // #ownProp
  itemCategoryId,
  dialogName,
}) {
  return (
    <ItemCategoryProvider
      itemCategoryId={itemCategoryId}
      dialogName={dialogName}
    >
      <ItemCategoryForm />
    </ItemCategoryProvider>
  );
}
