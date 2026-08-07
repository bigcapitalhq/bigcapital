import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ItemDetailActionsMoreBtn } from './ItemDetailActionsMoreBtn';
import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  Icon,
  FormattedMessage as T,
  Can,
  DrawerActionsBar,
} from '@/components';
import { ItemAction, AbilitySubject } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface ItemDetailActionsBarInnerProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDrawerActionsProps, 'closeDrawer'> {}

/**
 * Item action-bar of readonly details drawer.
 */
function ItemDetailActionsBarInner({
  openAlert,
  closeDrawer,
}: ItemDetailActionsBarInnerProps) {
  // Item readonly drawer context.
  const { itemId } = useItemDetailDrawerContext();

  const history = useHistory();

  // Handle edit item.
  const handleEditItem = () => {
    history.push(`/items/${itemId}/edit`);
    closeDrawer(DRAWERS.ITEM_DETAILS);
  };

  // Handle delete item.
  const handleDeleteItem = () => {
    openAlert('item-delete', { itemId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={ItemAction.Edit} a={AbilitySubject.Item}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_item'} />}
            onClick={handleEditItem}
          />
        </Can>
        <Can I={ItemAction.Delete} a={AbilitySubject.Item}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteItem}
          />
        </Can>
        <ItemDetailActionsMoreBtn />
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const ItemDetailActionsBar = compose(
  withDrawerActions,
  withAlertActions,
)(ItemDetailActionsBarInner);
