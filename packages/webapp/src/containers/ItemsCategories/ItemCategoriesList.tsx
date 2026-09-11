import * as FF from 'fp-ts/function';
import React, { useEffect } from 'react';
import '@/style/pages/ItemsCategories/List.scss';
import { ItemCategoriesTable } from './ItemCategoriesTable';
import { ItemsCategoriesListDialogs } from './ItemsCategoriesListDialogs';
import { ItemsCategoriesProvider } from './ItemsCategoriesProvider';
import { ItemsCategoryActionsBar } from './ItemsCategoryActionsBar';
import { withItemCategories } from './withItemCategories';
import { withItemCategoriesActions } from './withItemCategoriesActions';
import type { WithItemCategoriesProps } from './withItemCategories';
import type { WithItemCategoriesActionsProps } from './withItemCategoriesActions';
import { DashboardContentTable, DashboardPageContent } from '@/components';

interface ItemCategoryListProps
  extends Pick<WithItemCategoriesProps, 'itemsCategoriesTableState'>,
    Pick<WithItemCategoriesActionsProps, 'resetItemsCategoriesSelectedRows'> {}

/**
 * Item categories list.
 */
function ItemCategoryList({
  // #withItemCategories
  itemsCategoriesTableState,

  // #withItemCategoriesActions
  resetItemsCategoriesSelectedRows,
}: ItemCategoryListProps) {
  // Resets the selected rows once the page unmount.
  useEffect(
    () => () => {
      resetItemsCategoriesSelectedRows();
    },
    [resetItemsCategoriesSelectedRows],
  );

  return (
    <ItemsCategoriesProvider tableState={itemsCategoriesTableState}>
      <ItemsCategoryActionsBar />
      <ItemsCategoriesListDialogs />

      <DashboardPageContent>
        <DashboardContentTable>
          <ItemCategoriesTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </ItemsCategoriesProvider>
  );
}

export const ItemCategoriesList = FF.pipe(
  ItemCategoryList,
  withItemCategories(({ itemsCategoriesTableState }) => ({
    itemsCategoriesTableState,
  })),
  withItemCategoriesActions,
);
