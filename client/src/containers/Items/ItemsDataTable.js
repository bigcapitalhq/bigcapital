import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Icon, DataTable, Money, If, Choose } from 'components';

import LoadingIndicator from 'components/LoadingIndicator';
import withItems from 'containers/Items/withItems';
import { compose } from 'utils';


const ItemsDataTable = ({
  loading,

  // #withItems
  itemsTableLoading,
  itemsCurrentPage,

  // props
  onEditItem,
  onDeleteItem,
  onFetchData,
  onSelectedRowsChange,
}) => {
  const { formatMessage } = useIntl();
  const [initialMount, setInitialMount] = useState(false);

  useEffect(() => {
    if (!itemsTableLoading) {
      setInitialMount(true);
    }
  }, [itemsTableLoading, setInitialMount]);

  const handleEditItem = useCallback(
    (item) => () => {
      onEditItem && onEditItem(item);
    },
    [onEditItem],
  );

  // const handleDeleteItem = (item) => () => { onDeleteItem(item); };
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
        <MenuItem
          text={formatMessage({ id: 'delete_item' })}
          icon={<Icon icon="trash-16" iconSize={16} />}
          onClick={handleDeleteItem(item)}
          intent={Intent.DANGER}
        />
      </Menu>
    ),
    [handleEditItem, handleDeleteItem, formatMessage],
  );

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
        accessor: 'sku',
        className: 'sku',
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
        accessor: (row) => <Money amount={row.sell_price} currency={'USD'} />,
        className: 'sell-price',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'cost_price' }),
        accessor: (row) => <Money amount={row.cost_price} currency={'USD'} />,
        className: 'cost-price',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'quantity_on_hand' }),
        accessor: 'quantity_on_hand',
        className: 'quantity_on_hand',
        width: 140,
      },
      {
        Header: formatMessage({ id: 'average_rate' }),
        accessor: 'average_cost_rate',
        className: 'average_cost_rate',
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

  const selectionColumn = useMemo(
    () => ({
      minWidth: 42,
      width: 42,
      maxWidth: 42,
    }),
    [],
  );

  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args);
  }, []);

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );
  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        columns={columns}
        data={itemsCurrentPage}
        selectionColumn={selectionColumn}
        onFetchData={handleFetchData}
        loading={itemsTableLoading && !initialMount}
        noInitialFetch={true}
        expandable={true}
        treeGraph={true}
        spinnerProps={{ size: 30 }}
        onSelectedRowsChange={handleSelectedRowsChange}
        rowContextMenu={handleRowContextMenu}
      />
    </LoadingIndicator>
  );
};

export default compose(
  withItems(({ itemsCurrentPage, itemsTableLoading }) => ({
    itemsCurrentPage,
    itemsTableLoading,
  })),
)(ItemsDataTable);
