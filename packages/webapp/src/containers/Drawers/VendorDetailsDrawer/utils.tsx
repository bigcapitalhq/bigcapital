import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
} from '@blueprintjs/core';
import { Icon, FormattedMessage as T } from '@/components';

export interface VendorMoreMenuItemPayload {
  onEditOpeningBalance: () => void;
}

interface VendorMoreMenuItemProps {
  payload: VendorMoreMenuItemPayload;
}

/**
 * Vendor more actions menu items.
 */
export function VendorMoreMenuItem({
  payload: { onEditOpeningBalance },
}: VendorMoreMenuItemProps) {
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
          <MenuItem
            text={<T id={'vendor.drawer.action.edit_opening_balance'} />}
            onClick={onEditOpeningBalance}
          />
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
}
