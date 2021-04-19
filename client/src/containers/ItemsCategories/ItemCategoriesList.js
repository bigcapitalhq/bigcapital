import React from 'react';
import 'style/pages/ItemsCategories/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import ItemsCategoriesAlerts from './ItemsCategoriesAlerts';
import ItemsCategoryActionsBar from './ItemsCategoryActionsBar';
import { ItemsCategoriesProvider } from './ItemsCategoriesProvider';
import ItemCategoriesTable from './ItemCategoriesTable';

/**
 * Item categories list.
 */
export default function ItemCategoryList() {
  return (
    <ItemsCategoriesProvider>
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
