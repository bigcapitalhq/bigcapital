import React from 'react';

import '@/style/pages/ItemsCategories/List.scss';

import { ItemCategoriesTable } from './ItemCategoriesTable';
import { ItemsCategoriesProvider } from './ItemsCategoriesProvider';
import { ItemsCategoryActionsBar } from './ItemsCategoryActionsBar';
import { withItemCategories } from './withItemCategories';
import type { WithItemCategoriesProps } from './withItemCategories';
import { DashboardContentTable, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

interface ItemCategoryListProps
  extends Pick<WithItemCategoriesProps, 'itemsCategoriesTableState'> {}

/**
 * Item categories list.
 */
function ItemCategoryList({
  // #withItemCategories
  itemsCategoriesTableState,
}: ItemCategoryListProps) {
  return (
    <ItemsCategoriesProvider tableState={itemsCategoriesTableState}>
      <ItemsCategoryActionsBar />

      <DashboardPageContent>
        <DashboardContentTable>
          <ItemCategoriesTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </ItemsCategoriesProvider>
  );
}

// Note: original used `R.compose` from ramda, but ramda's stricter typing
// rejects the inner props shape. Switched to the codebase's untyped `compose`
// — runtime behavior is identical.
export const ItemCategoriesList = compose(
  withItemCategories(({ itemsCategoriesTableState }) => ({
    itemsCategoriesTableState,
  })),
)(ItemCategoryList);
