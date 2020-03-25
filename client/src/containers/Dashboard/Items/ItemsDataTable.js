import React, {useEffect, useMemo} from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Checkbox,
} from '@blueprintjs/core'
import LoadingIndicator from 'components/LoadingIndicator';
import CustomViewConnect from 'connectors/View.connector';
import ItemsConnect from 'connectors/Items.connect';
import {useParams} from 'react-router-dom'
import {compose} from 'utils';
import useAsync from 'hooks/async';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import {handleBooleanChange} from 'utils';

const ItemsDataTable = ({
  fetchItems,
  filterConditions,
  currentPageItems,
  onEditItem,
  onDeleteItem,
  addBulkActionItem,
  removeBulkActionItem,
}) => {
  const { custom_view_id: customViewId } = useParams();

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchItems({
        custom_view_id: customViewId,
        stringified_filter_roles: JSON.stringify(filterConditions),
      }),
    ]);
  });

  const handleEditItem = (item) => () => { onEditItem(item); };
  const handleDeleteItem = (item) => () => { onDeleteItem(item); };
  const handleClickCheckboxBulk = (item) => handleBooleanChange((value) => {
    if (value) {
      addBulkActionItem(item.id);
    } else {
      removeBulkActionItem(item.id);
    }
  });

  const actionMenuList = (item) =>
    (<Menu>
      <MenuItem text="View Details" />
      <MenuDivider />
      <MenuItem text="Edit Item" onClick={handleEditItem(item)} />
      <MenuItem text="Delete Item" onClick={handleDeleteItem(item)} />
    </Menu>);

  const columns = useMemo(() => [
    {
      id: 'bulk_select',
      Cell: ({ cell }) => 
        (<Checkbox onChange={handleClickCheckboxBulk(cell.row.original)} />),
    },
    {
      Header: 'Item Name',
      accessor: 'name',
      className: "actions",
    },
    {
      Header: 'Cost Account',
      accessor: 'cost_account.name',
      className: "cost-account",
    },
    {
      Header: 'Sell Account',
      accessor: 'sell_account.name',
      className: "sell-account",
    },
    {
      Header: 'Inventory Account',
      accessor: 'inventory_account.name',
      className: "inventory-account",
    },
    {
      Header: 'Category',
      accessor: 'category.name',
      className: 'category',
    },
    {
      id: 'actions',
      Cell: ({ cell }) => (
        <Popover
          content={actionMenuList(cell.row.original)}
          position={Position.RIGHT_BOTTOM}>
          <Button icon={<Icon icon="ellipsis-h" />} />
        </Popover>
      ),
    },
  ]);

  return (
    <LoadingIndicator loading={fetchHook.pending} spinnerSize={30}>
      <DataTable
        columns={columns}
        data={currentPageItems} />
    </LoadingIndicator>
  );
};

export default compose(
  ItemsConnect,
  CustomViewConnect,
)(ItemsDataTable);