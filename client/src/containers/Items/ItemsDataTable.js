import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Intent,
  Tag,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';

import {
  Icon,
  DataTable,
  Money,
  LoadingIndicator,
  Choose,
  If,
} from 'components';
import ItemsEmptyStatus from './ItemsEmptyStatus';
import { useIsValuePassed } from 'hooks';
import { CLASSES } from 'common/classes';

import withItems from 'containers/Items/withItems';
import withItemsActions from 'containers/Items/withItemsActions';
import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose, saveInvoke, isBlank, defaultToTransform } from 'utils';

// Items datatable.
function ItemsDataTable({
  // #withItems
  itemsTableLoading,
  itemsCurrentPage,
  itemsTableQuery,
  itemsCurrentViewId,
  itemsPagination,

  // #withDialogActions
  openDialog,

  // #withItemsActions
  addItemsTableQueries,

  // #withSettings
  baseCurrency,

  // props
  onEditItem,
  onDeleteItem,
  onInactiveItem,
  onActivateItem,
  onSelectedRowsChange,
  itemsViewLoading,
}) {
  const { formatMessage } = useIntl();
  const isLoadedBefore = useIsValuePassed(itemsTableLoading, false);

  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addItemsTableQueries({
        page_size: pageSize,
        page: pageIndex + 1,
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
      });
    },
    [addItemsTableQueries],
  );

  const handleMakeAdjustment = useCallback(
    (item) => () => {
      openDialog('inventory-adjustment-form', {
        action: 'make_adjustment',
        item_id: item.id,
        quantity_on_hand: item.quantity_on_hand,
      });
    },
    [openDialog],
  );

  const handleEditItem = useCallback(
    (item) => () => {
      onEditItem && onEditItem(item);
    },
    [onEditItem],
  );

  const handleDeleteItem = useCallback(
    (item) => () => {
      onDeleteItem(item);
    },
    [onDeleteItem],
  );

  const actionMenuList = useCallback(
    (item) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_item' })}
          onClick={handleEditItem(item)}
        />
        <If condition={item.active}>
          <MenuItem
            text={formatMessage({ id: 'inactivate_item' })}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={() => onInactiveItem(item)}
          />
        </If>
        <If condition={!item.active}>
          <MenuItem
            text={formatMessage({ id: 'activate_item' })}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={() => onActivateItem(item)}
          />
        </If>

        <If condition={item.type === 'inventory'}>
          <MenuItem
            text={formatMessage({ id: 'make_adjustment' })}
            onClick={handleMakeAdjustment(item)}
          />
        </If>
        <MenuItem
          text={formatMessage({ id: 'delete_item' })}
          icon={<Icon icon="trash-16" iconSize={16} />}
          onClick={handleDeleteItem(item)}
          intent={Intent.DANGER}
        />
      </Menu>
    ),
    [
      handleEditItem,
      handleDeleteItem,
      onInactiveItem,
      onActivateItem,
      formatMessage,
    ],
  );

  const quantityonHandCell = ({ value: quantity }) => {
    return quantity <= 0 ? (
      <span className={'quantity_on_hand'}>{quantity}</span>
    ) : (
      <span>{quantity}</span>
    );
  };

  const handleRowContextMenu = useCallback(
    (cell) => {
      return actionMenuList(cell.row.original);
    },
    [actionMenuList],
  );

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'item_name' }),
        accessor: 'name',
        className: 'name',
        width: 180,
      },
      {
        Header: formatMessage({ id: 'item_code' }),
        accessor: 'code',
        className: 'code',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'item_type' }),
        accessor: (row) =>
          row.type ? (
            <Tag minimal={true} round={true} intent={Intent.NONE}>
              {formatMessage({ id: row.type })}
            </Tag>
          ) : (
            ''
          ),
        className: 'item_type',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'category' }),
        accessor: 'category.name',
        className: 'category',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'sell_price' }),
        accessor: (row) =>
          !isBlank(row.sell_price) ? (
            <Money amount={row.sell_price} currency={baseCurrency} />
          ) : (
            ''
          ),
        className: 'sell-price',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'cost_price' }),
        accessor: (row) =>
          !isBlank(row.cost_price) ? (
            <Money amount={row.cost_price} currency={baseCurrency} />
          ) : (
            ''
          ),
        className: 'cost-price',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'quantity_on_hand' }),
        accessor: 'quantity_on_hand',
        Cell: quantityonHandCell,
        width: 140,
      },
      {
        id: 'actions',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_BOTTOM}
          >
            <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
      },
    ],
    [actionMenuList, formatMessage],
  );

  // Handle selected row change.
  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      saveInvoke(
        onSelectedRowsChange,
        selectedRows.map((s) => s.original),
      );
    },
    [onSelectedRowsChange],
  );

  const rowClassNames = (row) => {
    return {
      inactive: !row.original.active,
    };
  };

  const showEmptyStatus = [
    itemsCurrentPage.length === 0,
    itemsCurrentViewId === -1,
  ].every((condition) => condition === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator
        loading={(itemsTableLoading && !isLoadedBefore) || itemsViewLoading}
      >
        <Choose>
          <Choose.When condition={showEmptyStatus}>
            <ItemsEmptyStatus />
          </Choose.When>

          <Choose.Otherwise>
            <DataTable
              columns={columns}
              data={itemsCurrentPage}
              onFetchData={handleFetchData}
              noInitialFetch={true}
              selectionColumn={true}
              spinnerProps={{ size: 30 }}
              onSelectedRowsChange={handleSelectedRowsChange}
              rowContextMenu={handleRowContextMenu}
              expandable={false}
              sticky={true}
              rowClassNames={rowClassNames}
              pagination={true}
              pagesCount={itemsPagination.pagesCount}
              autoResetSortBy={false}
              autoResetPage={false}
              initialPageSize={itemsTableQuery.page_size}
              initialPageIndex={itemsTableQuery.page - 1}
            />
          </Choose.Otherwise>
        </Choose>
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withItems(
    ({
      itemsCurrentPage,
      itemsTableLoading,
      itemsTableQuery,
      itemsCurrentViewId,
      itemsPagination,
    }) => ({
      itemsCurrentPage,
      itemsTableLoading,
      itemsTableQuery,
      itemsCurrentViewId,
      itemsPagination,
    }),
  ),
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
  withItemsActions,
  withDialogActions,
)(ItemsDataTable);
