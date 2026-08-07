import {
  Button,
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import * as R from 'ramda';
import React from 'react';
import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { Can, Icon, T } from '@/components';
import {
  AbilitySubject,
  InventoryAdjustmentAction,
} from '@/constants/abilityOption';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface ItemDetailActionsMoreBtnInnerProps
  extends Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Item details more actions menu.
 */
const ItemDetailActionsMoreBtnInner = ({
  openDialog,
}: ItemDetailActionsMoreBtnInnerProps) => {
  const { itemId, item } = useItemDetailDrawerContext();

  if (!item || item.type !== 'inventory') return null;

  const handleInventoryAdjustment = () => {
    openDialog('inventory-adjustment', { itemId });
  };

  return (
    <Popover
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      content={
        <Menu>
          <Can
            I={InventoryAdjustmentAction.Edit}
            a={AbilitySubject.InventoryAdjustment}
          >
            <MenuItem
              text={<T id={'item.view_drawer.make_adjustment'} />}
              onClick={handleInventoryAdjustment}
            />
          </Can>
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
};

export const ItemDetailActionsMoreBtn = R.compose(withDialogActions)(
  ItemDetailActionsMoreBtnInner,
);
