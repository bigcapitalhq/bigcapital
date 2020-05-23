import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core'
import { FormattedMessage as T, useIntl } from 'react-intl';
import {compose} from 'utils';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Money from 'components/Money';

import withItems from 'containers/Items/withItems';
import LoadingIndicator from 'components/LoadingIndicator';

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

  
  const {formatMessage} = useIntl();
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
    [onEditItem]
  );


  const handleDeleteItem = (item) => () => { onDeleteItem(item); };
  
  const actionMenuList = useCallback((item) =>
    (<Menu>
      <MenuItem text={<T id={'view_details'}/>} />
      <MenuDivider />
      <MenuItem text={<T id={'edit_item'}/>} onClick={handleEditItem(item)} />
      <MenuItem text={<T id={'delete_item'}/>} onClick={handleDeleteItem(item)} />
    </Menu>), [handleEditItem, handleDeleteItem]);
 
  const columns = useMemo(() => [
    
    {
      Header: formatMessage({ id:'item_name' }),
      accessor: 'name',
      className: "actions",
    },
    {
      Header: formatMessage({ id:'sku' }),
      accessor: 'sku',
      className: "sku",
    },
    {
      Header: formatMessage({ id:'category' }),
      accessor: 'category.name',
      className: 'category',
    },
    {
      Header: formatMessage({ id: 'sell_price' }),
      accessor: row => (<Money amount={row.sell_price} currency={'USD'} />),
      className: 'sell-price',
    },
    {
      Header: formatMessage({ id: 'cost_price' }),
      accessor: row => (<Money amount={row.cost_price} currency={'USD'} />),
      className: 'cost-price',
    },
    // {
    //   Header: 'Cost Account',
    //   accessor: 'cost_account.name',
    //   className: "cost-account",
    // },
    // {
    //   Header: 'Sell Account',
    //   accessor: 'sell_account.name',
    //   className: "sell-account",
    // },
    // {
    //   Header: 'Inventory Account',
    //   accessor: 'inventory_account.name',
    //   className: "inventory-account",
    // },
    {
      id: 'actions',
      Cell: ({ cell }) => (
        <Popover
          content={actionMenuList(cell.row.original)}
          position={Position.RIGHT_BOTTOM}>
          <Button icon={<Icon icon="ellipsis-h" />} />
        </Popover>
      ),
      className: 'actions',
      width: 50,
    },
  ], [actionMenuList]);

  const selectionColumn = useMemo(() => ({
    minWidth: 42,
    width: 42,
    maxWidth: 42,
  }), []);

  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args)
  }, [onFetchData]);

  const handleSelectedRowsChange = useCallback((selectedRows) => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows.map(s => s.original));
  }, [onSelectedRowsChange]);

  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        columns={columns}
        data={itemsCurrentPage}
        selectionColumn={selectionColumn}
        onFetchData={handleFetchData}
        loading={itemsTableLoading && !initialMount}
        noInitialFetch={true}
        onSelectedRowsChange={handleSelectedRowsChange} />
    </LoadingIndicator>
  );
};

export default compose(

  withItems(({ itemsCurrentPage, itemsTableLoading }) => ({
    itemsCurrentPage,
    itemsTableLoading,
  })),
)(ItemsDataTable);