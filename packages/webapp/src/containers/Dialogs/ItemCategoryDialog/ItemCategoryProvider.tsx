// @ts-nocheck
import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import {
  useItemCategory,
  useEditItemCategory,
  useCreateItemCategory,
} from '@/hooks/query';

const ItemCategoryContext = createContext();

/**
 * Accounts chart data provider.
 */
function ItemCategoryProvider({ itemCategoryId, dialogName, ...props }) {
  const { data: itemCategory, isFetching: isItemCategoryLoading } = useItemCategory(
    itemCategoryId,
    {
      enabled: !!itemCategoryId,
    },
  );
  // Create and edit item category mutations.
  const { mutateAsync: createItemCategoryMutate } = useCreateItemCategory();
  const { mutateAsync: editItemCategoryMutate } = useEditItemCategory();

  // Determines whether the new mode form.
  const isNewMode = !itemCategoryId;
  const isEditMode = !isNewMode;

  // Provider state.
  const provider = {
    itemCategoryId,
    dialogName,

    itemCategory,
    isItemCategoryLoading,

    createItemCategoryMutate,
    editItemCategoryMutate,

    isNewMode,
    isEditMode
  };

  return (
    <DialogContent
      isLoading={isItemCategoryLoading}
      name={'item-category-form'}
    >
      <ItemCategoryContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useItemCategoryContext = () =>
  React.useContext(ItemCategoryContext);

export { ItemCategoryProvider, useItemCategoryContext };
