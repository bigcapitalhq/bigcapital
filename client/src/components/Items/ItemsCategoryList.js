import React, { useEffect, useCallback, useState, useMemo } from 'react';
import Icon from 'components/Icon';
import ItemsCategoryConnect from 'connectors/ItemsCategory.connect';
import DialogConnect from 'connectors/Dialog.connector';
import LoadingIndicator from 'components/LoadingIndicator';
import { compose } from 'utils';
import DataTable from 'components/DataTable';
import { Button, Popover, Menu, MenuItem, Position } from '@blueprintjs/core';

const ItemsCategoryList = ({
  categories,
  onFetchData,
  onDeleteCategory,
  onEditCategory,
  openDialog
}) => {
  const handelEditCategory = category => () => {
    openDialog('item-form', { action: 'edit', id: category.id });
    onEditCategory(category.id);
  };

  const handleDeleteCategory = category => () => {
    onDeleteCategory(category);
  };

  const actionMenuList = category => (
    <Menu>
      <MenuItem text='Edit Category' onClick={handelEditCategory(category)} />
      <MenuItem
        text='Delete Category'
        onClick={handleDeleteCategory(category)}
      />
    </Menu>
  );

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: 'Category Name',
        accessor: 'name'
      },
      {
        id: 'description',
        Header: 'Description',
        accessor: 'description'
      },
      {
        id: 'count',
        Header: 'Count',
        // accessor: ''
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
        width: 50
        // canResize: false
      }
    ],
    []
  );

  const handelFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, []);

  return (
    <LoadingIndicator spinnerSize={30}>
      <DataTable
        columns={columns}
        data={Object.values(categories)}
        onFetchData={handelFetchData}
        manualSortBy={true}
        selectionColumn={true}
      />
    </LoadingIndicator>
  );
};

export default compose(DialogConnect, ItemsCategoryConnect)(ItemsCategoryList);
