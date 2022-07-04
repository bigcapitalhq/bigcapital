import React from 'react';
import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
} from '@blueprintjs/core';

import { Icon, FormattedMessage as T } from '@/components';

function MoreMenuItems({ payload: { onNotifyViaSMS } }) {
  return (
    <Popover
      minimal={true}
      content={
        <Menu>
          <MenuItem
            onClick={onNotifyViaSMS}
            text={<T id={'notify_via_sms.dialog.notify_via_sms'} />}
          />
        </Menu>
      }
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
}

export default MoreMenuItems;
