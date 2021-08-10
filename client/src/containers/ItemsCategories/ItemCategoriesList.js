import React from 'react';
import * as R from 'ramda';

import 'style/pages/ItemsCategories/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import ItemsCategoriesAlerts from './ItemsCategoriesAlerts';
import ItemsCategoryActionsBar from './ItemsCategoryActionsBar';
import { ItemsCategoriesProvider } from './ItemsCategoriesProvider';
import ItemCategoriesTable from './ItemCategoriesTable';

import withItemsCategories from './withItemCategories';

/**
 * Item categories list.
 */
function ItemCategoryList({
  // #withItemsCategories
  itemsCategoriesTableState
}) {
  return (
    <ItemsCategoriesProvider tableState={itemsCategoriesTableState}>
      <ItemsCategoryActionsBar />

      <DashboardPageContent>
        <DashboardContentTable>
          <ItemCategoriesTable />
        </DashboardContentTable>
      </DashboardPageContent>
      <ItemsCategoriesAlerts />
    </ItemsCategoriesProvider>
  );
}

export default R.compose(
  withItemsCategories(({ itemsCategoriesTableState }) => ({
    itemsCategoriesTableState,
  })),
)(ItemCategoryList);
