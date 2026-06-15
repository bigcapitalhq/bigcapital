// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import '@/style/pages/ItemsCategories/List.scss';

import { DashboardContentTable, DashboardPageContent } from '@/components';
import { ItemsCategoriesProvider } from './ItemsCategoriesProvider';

import { ItemCategoriesTable } from './ItemCategoriesTable';
import { ItemsCategoryActionsBar } from './ItemsCategoryActionsBar';
import { withItemCategories } from './withItemCategories';
import { flow } from 'fp-ts/function';

/**
 * Item categories list.
 */
function ItemCategoryList({
  // #withItemCategories
  itemsCategoriesTableState,
}) {
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

export const ItemCategoriesList = flow(
  withItemCategories(({ itemsCategoriesTableState }) => ({
    itemsCategoriesTableState,
  })),
)(ItemCategoryList);
