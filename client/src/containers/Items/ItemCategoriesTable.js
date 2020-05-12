import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
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

  const handelEditCategory = (category) => { onEditCategory(category); };
  const handleDeleteCategory = (category) => { onDeleteCategory(category); };

  const actionMenuList = (category) => (
    <Menu>
      <MenuItem
        text={<T id={'edit_category'} />}
        onClick={() => handelEditCategory(category)} />
      <MenuItem
        text={<T id={'delete_category'}/>}
        onClick={() => handleDeleteCategory(category)}
      />
    </Menu>
  );

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
  ], [actionMenuList]);

  const handelFetchData = useCallback((...params) => {
    onFetchData && onFetchData(...params);
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
  withItemCategories(({ categoriesList }) => ({
    categoriesList,
  })),
)(ItemsCategoryList);
