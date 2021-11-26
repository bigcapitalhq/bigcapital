import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';
import { ItemAction, AbilitySubject } from '../../../common/abilityOption';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T, Can } from 'components';

import { compose } from 'utils';

/**
 * Item action-bar of readonly details drawer.
 */
function ItemDetailActionsBar({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  // Item readonly drawer context.
  const { itemId } = useItemDetailDrawerContext();

  const history = useHistory();

  // Handle edit item.
  const handleEditItem = () => {
    history.push(`/items/${itemId}/edit`);
    closeDrawer('item-detail-drawer');
  };

  // Handle delete item.
  const handleDeleteItem = () => {
    openAlert('item-delete', { itemId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={ItemAction.Edit} a={AbilitySubject.Item}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_item'} />}
            onClick={handleEditItem}
          />

          <NavbarDivider />
        </Can>
        <Can I={ItemAction.Delete} a={AbilitySubject.Item}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteItem}
          />
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDrawerActions,
  withAlertsActions,
)(ItemDetailActionsBar);
