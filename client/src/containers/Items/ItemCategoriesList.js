import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import AppToaster from 'components/AppToaster';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ItemCategoriesDataTable from 'containers/Items/ItemCategoriesTable';
import ItemsCategoryActionsBar from 'containers/Items/ItemsCategoryActionsBar';

import withDialog from 'connectors/Dialog.connector';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';

import { compose } from 'utils';

const ItemCategoryList = ({
  // #withDashboardActions
  changePageTitle,

  // #withItemCategoriesActions
  requestFetchItemCategories,
  requestDeleteItemCategory,
  requestDeleteBulkItemCategories,

  // #withDialog
  openDialog,
}) => {
  const { id } = useParams();

  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState({});
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const { formatMessage } = useIntl();

  useEffect(() => {
    id
      ? changePageTitle(formatMessage({ id: 'edit_category_details' }))
      : changePageTitle(formatMessage({ id: 'category_list' }));
  }, [id, changePageTitle, formatMessage]);

  const fetchCategories = useQuery(
    ['items-categories-table', filter],
    (key, query) => requestFetchItemCategories(query),
  );

  const handleFilterChanged = useCallback(() => {}, []);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (itemCategories) => {
      setSelectedRows(itemCategories);
    },
    [setSelectedRows],
  );

  // Handle fetch data of accounts datatable.
  const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy }) => {
    setFilter({
      ...(sortBy.length > 0
        ? {
            column_sort_by: sortBy[0].id,
            sort_order: sortBy[0].desc ? 'desc' : 'asc',
          }
        : {}),
    });
  }, []);

  const handleDeleteCategory = (itemCategory) => {
    setDeleteCategory(itemCategory);
  };
  const handleCancelItemDelete = () => {
    setDeleteCategory(false);
  };

  // Handle alert confirm delete item category.
  const handleConfirmItemDelete = () => {
    requestDeleteItemCategory(deleteCategory.id)
      .then(() => {
        setDeleteCategory(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_category_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        setDeleteCategory(false);
      });
  };

  const handleEditCategory = (category) => {
    openDialog('item-category-form', { action: 'edit', id: category.id });
  };

  // Handle itemCategories bulk delete.
  const handleBulkDelete = useCallback(
    (itemsCategoriesIds) => {
      setBulkDelete(itemsCategoriesIds);
    },
    [setBulkDelete],
  );

  // handle confirm itemCategories bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkItemCategories(bulkDelete)
      .then(() => {
        setBulkDelete(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_categories_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setBulkDelete(false);
      });
  }, [requestDeleteBulkItemCategories, bulkDelete, formatMessage]);

  //Handel cancel itemCategories bulk delete.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  // Calculates the data table selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  return (
    <DashboardInsider name={'item-category-list'}>
      <ItemsCategoryActionsBar
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
        onBulkDelete={handleBulkDelete}
      />

      <ItemCategoriesDataTable
        onEditCategory={handleEditCategory}
        onFetchData={handleFetchData}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDeleteCategory={handleDeleteCategory}
        loading={tableLoading}
      />

      <Alert
        cancelButtonText={<T id={'cancel'} />}
        confirmButtonText={<T id={'delete'} />}
        icon="trash"
        intent={Intent.DANGER}
        isOpen={deleteCategory}
        onCancel={handleCancelItemDelete}
        onConfirm={handleConfirmItemDelete}
      >
        <p>
          <FormattedHTMLMessage
            id={'once_delete_this_item_category_you_will_able_to_restore_it'}
          />
        </p>
      </Alert>

      <Alert
        cancelButtonText={<T id={'cancel'} />}
        confirmButtonText={`${formatMessage({
          id: 'delete',
        })} (${selectedRowsCount})`}
        icon="trash"
        intent={Intent.DANGER}
        isOpen={bulkDelete}
        onCancel={handleCancelBulkDelete}
        onConfirm={handleConfirmBulkDelete}
      >
        <p>
          <FormattedHTMLMessage
            id={
              'once_delete_these_item_categories_you_will_not_able_restore_them'
            }
          />
        </p>
      </Alert>
    </DashboardInsider>
  );
};

export default compose(
  withItemCategoriesActions,
  withDashboardActions,
  withDialog,
)(ItemCategoryList);
