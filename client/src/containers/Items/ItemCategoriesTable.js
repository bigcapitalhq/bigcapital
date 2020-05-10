import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import Icon from 'components/Icon';
import LoadingIndicator from 'components/LoadingIndicator';
import { compose } from 'utils';
import DataTable from 'components/DataTable';

import DialogConnect from 'connectors/Dialog.connector';
import withItemCategories from './withItemCategories';


const ItemsCategoryList = ({
  // #withItemCategories
  categoriesList,

  onFetchData,
  onDeleteCategory,
  onEditCategory,
  openDialog,
  count,
  onSelectedRowsChange,
}) => {
  const handelEditCategory = (category) => () => {
    openDialog('item-form', { action: 'edit', id: category.id });
    onEditCategory(category.id);
  };

  const handleDeleteCategory = (category) => () => {
    onDeleteCategory(category);
  };

  const actionMenuList = (category) => (
    <Menu>
      <MenuItem text='Edit Category' onClick={handelEditCategory(category)} />
      <MenuItem
        text='Delete Category'
        onClick={handleDeleteCategory(category)}
      />
    </Menu>
  );

  const columns = useMemo(() => [
    {
      id: 'name',
      Header: 'Category Name',
      accessor: 'name',
      width: 150,
    },
    {
      id: 'description',
      Header: 'Description',
      accessor: 'description',
      className: 'description',
      width: 150,
    },
    {
      id: 'count',
      Header: 'Count',
      accessor: (r) => r.count || '',
      className: 'count',
      width: 50,
    },
    {
      id: 'actions',
      Header: '',
      Cell: ({ cell }) => (
        <Popover
          content={actionMenuList(cell.row.original)}
          position={Position.RIGHT_BOTTOM}
        >
          <Button icon={<Icon icon='ellipsis-h' />} />
        </Popover>
      ),
      className: 'actions',
      width: 50,
      disableResizing: false
    },
  ], [actionMenuList]);

  const handelFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, []);

  const handleSelectedRowsChange = useCallback((selectedRows) => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows.map(s => s.original));
  }, [onSelectedRowsChange]);

  return (
    <LoadingIndicator spinnerSize={30}>
      <DataTable
        columns={columns}
        data={categoriesList}
        onFetchData={handelFetchData}
        manualSortBy={true}
        selectionColumn={true}
        expandable={true}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
    </LoadingIndicator>
  );
};

export default compose(
  DialogConnect,
  withItemCategories(({ categoriesList }) => ({
    categoriesList,
  })),
)(ItemsCategoryList);
