import React, { memo } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import ItemsViewsTabs from 'containers/Items/ItemsViewsTabs';
import ItemsDataTable from 'containers/Items/ItemsDataTable';
import withItemsActions from 'containers/Items/withItemsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import { compose } from 'utils';

function ItemsViewPage({
  // #withAlertsActions.
  openAlert,

  // #withItemsActions.
  setSelectedRowsItems,
}) {
  const history = useHistory();

  // Handle delete action Item.
  const handleDeleteItem = ({ id }) => {
    openAlert('item-delete', { itemId: id });
  };

  // Handle cancel/confirm item inactive.
  const handleInactiveItem = ({ id }) => {
    openAlert('item-inactivate', { itemId: id });
  };

  // Handle cancel/confirm item activate.
  const handleActivateItem = ({ id }) => {
    openAlert('item-activate', { itemId: id });
  };

  // Handle select item rows.
  const handleSelectedRowsChange = (selectedRows) => {
    const selectedRowsIds = selectedRows.map((r) => r.id);
    setSelectedRowsItems(selectedRowsIds);
  };

  // Handle Edit item.
  const handleEditItem = ({ id }) => {
    history.push(`/items/${id}/edit`);
  };

  return (
    <Switch>
      <Route
        exact={true}
        path={['/items/:custom_view_id/custom_view', '/items']}
      >
        <ItemsViewsTabs />

        <ItemsDataTable
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
          onInactiveItem={handleInactiveItem}
          onActivateItem={handleActivateItem}
          onSelectedRowsChange={handleSelectedRowsChange}
        />
      </Route>
    </Switch>
  );
}

const ItemsViewPageMemo = memo(ItemsViewPage);

export default compose(withAlertsActions, withItemsActions)(ItemsViewPageMemo);
