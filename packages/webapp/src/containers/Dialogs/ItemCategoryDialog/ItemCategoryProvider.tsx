import React, { createContext } from 'react';
import type { ItemCategoryContextValue } from './types';
import { DialogContent } from '@/components';
import {
  useItemCategory,
  useEditItemCategory,
  useCreateItemCategory,
} from '@/hooks/query';

const ItemCategoryContext = createContext<ItemCategoryContextValue>(
  {} as ItemCategoryContextValue,
);

interface ItemCategoryProviderProps {
  itemCategoryId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

function ItemCategoryProvider({
  itemCategoryId,
  dialogName,
  ...props
}: ItemCategoryProviderProps) {
  const { data: itemCategory, isFetching: isItemCategoryLoading } =
    useItemCategory(itemCategoryId ?? undefined, {
      enabled: !!itemCategoryId,
    });
  const { mutateAsync: createItemCategoryMutate } = useCreateItemCategory();
  const { mutateAsync: editItemCategoryMutate } = useEditItemCategory();

  const isNewMode = !itemCategoryId;
  const isEditMode = !isNewMode;

  const provider: ItemCategoryContextValue = {
    itemCategoryId,
    dialogName,

    itemCategory,
    isItemCategoryLoading,

    createItemCategoryMutate,
    editItemCategoryMutate,

    isNewMode,
    isEditMode,
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

const useItemCategoryContext = () => React.useContext(ItemCategoryContext);

export { ItemCategoryProvider, useItemCategoryContext };
