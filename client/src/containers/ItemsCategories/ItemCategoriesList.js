import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import ItemsCategoriesAlerts from './ItemsCategoriesAlerts';
import ItemsCategoryActionsBar from './ItemsCategoryActionsBar';
import { ItemsCategoriesProvider } from './ItemsCategoriesProvider';
import ItemCategoriesViewPage from './ItemCategoriesViewPage';

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

  useEffect(() => {
    id
      ? changePageTitle(formatMessage({ id: 'edit_category_details' }))
      : changePageTitle(formatMessage({ id: 'category_list' }));
  }, [id, changePageTitle, formatMessage]);

  return (
    <ItemsCategoriesProvider query={{}}>
      <ItemsCategoryActionsBar />

      <DashboardPageContent>
        <ItemCategoriesViewPage />
      </DashboardPageContent>
      <ItemsCategoriesAlerts />
    </ItemsCategoriesProvider>
  );
};

export default compose(
  withDashboardActions,
)(ItemCategoryList);
