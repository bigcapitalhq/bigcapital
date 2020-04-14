import React, { useEffect, useState, useCallback } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import useAsync from 'hooks/async';
import { useParams } from 'react-router-dom';
import DashboardConnect from 'connectors/Dashboard.connector';
import ItemsCategoryConnect from 'connectors/ItemsCategory.connect';
import { compose } from 'utils';
import ItemsCategoryList from 'components/Items/ItemsCategoryList';
import ItemsCategoryActionsBar from './ItemsCategoryActionsBar';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

const ItemCategoriesList = ({
  changePageTitle,
  views,
  requestFetchItemCategories,
  requestEditItemCategory,
  requestDeleteItemCategory,
}) => {
  const { id } = useParams();
  const [deleteCategory, setDeleteCategory] = useState(false);

  useEffect(() => {
    id
      ? changePageTitle('Edit Item Details')
      : changePageTitle('Categories List');
  }, []);

  const fetchHook = useAsync(async () => {
    await Promise.all([requestFetchItemCategories()]);
  }, false);

  const handelDeleteCategory = category => {
    setDeleteCategory(category);
  };

  const handelEditCategory = category => {};
  const handelCancelCategoryDelete = () => {
    setDeleteCategory(false);
  };

  const handelConfirmCategoryDelete = useCallback(() => {
    requestDeleteItemCategory(deleteCategory.id).then(() => {
      setDeleteCategory(false);
      AppToaster.show({
        message: 'the_category_has_been_delete'
      });
    });
  }, [deleteCategory]);

  const handleFetchData = useCallback(() => {
    fetchHook.execute();
  }, []);
  return (
    <DashboardInsider loading={fetchHook.pending}>
      <ItemsCategoryActionsBar
        views={views}
        onDeleteCategory={handelDeleteCategory}
      />
      <DashboardPageContent>
        <ItemsCategoryList
          onDeleteCategory={handelDeleteCategory}
          onFetchData={handleFetchData}
          onEditCategory={handelEditCategory}
          categories
        />

        <Alert
          cancelButtonText='Cancel'
          confirmButtonText='Move to Trash'
          icon='trash'
          intent={Intent.DANGER}
          isOpen={deleteCategory}
          onCancel={handelCancelCategoryDelete}
          onConfirm={handelConfirmCategoryDelete}
        >
          <p>
            Are you sure you want to move <b>filename</b> to Trash? You will be
            able to restore it later, but it will become private to you.
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
};

export default compose(
  DashboardConnect,
  ItemsCategoryConnect
)(ItemCategoriesList);
