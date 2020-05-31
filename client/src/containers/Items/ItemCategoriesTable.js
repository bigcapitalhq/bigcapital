import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
  Intent
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import Icon from 'components/Icon';
import LoadingIndicator from 'components/LoadingIndicator';
import { compose } from 'utils';
import DataTable from 'components/DataTable';

import withItemCategories from './withItemCategories';


const ItemsCategoryList = ({
  // #withItemCategories
  categoriesList,

  // #ownProps
  onFetchData,
  onDeleteCategory,
  onEditCategory,
  onSelectedRowsChange,
}) => {
  const {formatMessage} = useIntl();

  const handelEditCategory=useCallback((category)=>{onEditCategory(category);},[onEditCategory])
  const handleDeleteCategory =useCallback((category)=>{onDeleteCategory(category);},[onDeleteCategory])
  const actionMenuList = useCallback((category) => (
    <Menu>
      <MenuItem
        text={<T id={'edit_category'} />}
        onClick={() => handelEditCategory(category)} />
      <MenuItem
        text={<T id={'delete_category'}/>}
        intent={Intent.DANGER}
        onClick={() => handleDeleteCategory(category)}
      />
    </Menu>
  ), [handelEditCategory,handleDeleteCategory]);


  const columns = useMemo(() => [
    {
      id: 'name',
      Header: formatMessage({ id:'category_name' }),
      accessor: 'name',
      width: 150,
    },
    {
      id: 'description',
      Header: formatMessage({ id:'description' }),
      accessor: 'description',
      className: 'description',
      width: 150,
    },
    {
      id: 'count',
      Header: formatMessage({ id:'count' }),
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
  ], [actionMenuList,formatMessage]);

  const handelFetchData = useCallback((...params) => {
    onFetchData && onFetchData(...params);
  }, [onFetchData]);

  const handleSelectedRowsChange = useCallback((selectedRows) => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows.map(s => s.original));
  }, [onSelectedRowsChange]);

  const selectionColumn = useMemo(() => ({
    minWidth: 42,
    width: 42,
    maxWidth: 42,
  }), []);


  return (
    <LoadingIndicator mount={false} >
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={categoriesList}
        onFetchData={handelFetchData}
        manualSortBy={true}
        selectionColumn={selectionColumn}
        expandable={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        treeGraph={true}
        spinnerProps={{size:30}}
      />
    </LoadingIndicator>
  );
};

export default compose(
  withItemCategories(({ categoriesList }) => ({
    categoriesList,
  })),
)(ItemsCategoryList);
