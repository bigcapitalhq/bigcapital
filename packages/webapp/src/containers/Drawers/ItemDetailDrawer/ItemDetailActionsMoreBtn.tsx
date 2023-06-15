// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Can, Icon, T } from '@/components';
import {
  Button,
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import {
  AbilitySubject,
  InventoryAdjustmentAction,
} from '@/constants/abilityOption';
import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Invoice details more actions menu.
 * @returns {React.JSX}
 */
export const ItemDetailActionsMoreBtn = R.compose(withDialogActions)(
  ({
    //#withDialogActions,
    openDialog,
  }) => {
    const { itemId, item } = useItemDetailDrawerContext();

    // Cannot continue if the item type is not inventory.
    if (item.type !== 'inventory') return null;

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
  },
);
