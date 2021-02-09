import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import ItemsCategoriesAlerts from './ItemsCategoriesAlerts';
import ItemsCategoryActionsBar from './ItemsCategoryActionsBar';
import { ItemsCategoriesProvider } from './ItemsCategoriesProvider';
import ItemCategoriesTable from './ItemCategoriesTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { compose } from 'utils';

/**
 * Item categories list.
 */
const ItemCategoryList = ({
  // #withDashboardActions
  changePageTitle,
}) => {
  const { id } = useParams();
  const { formatMessage } = useIntl();

  // Changes the dashboard page title once the page mount.
  useEffect(() => {
    id
      ? changePageTitle(formatMessage({ id: 'edit_category_details' }))
      : changePageTitle(formatMessage({ id: 'category_list' }));
  }, [id, changePageTitle, formatMessage]);

  return (
    <ItemsCategoriesProvider query={{}}>
      <ItemsCategoryActionsBar />

      <DashboardPageContent>
        <ItemCategoriesTable />
      </DashboardPageContent>
      <ItemsCategoriesAlerts />
    </ItemsCategoriesProvider>
  );
};

export default compose(
  withDashboardActions,
)(ItemCategoryList);
