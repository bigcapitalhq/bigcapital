import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Intent,
  Tag,
} from '@blueprintjs/core';
import React from 'react';
import type { ReceiptDetail } from './ReceiptDetailDrawerProvider';
import { Icon, Choose, T } from '@/components';

interface ReceiptDetailsStatusProps {
  receipt: ReceiptDetail;
}

interface ReceiptMoreMenuItemsPayload {
  onNotifyViaSMS: () => void;
}

interface ReceiptMoreMenuItemsProps {
  payload: ReceiptMoreMenuItemsPayload;
}

/**
 * Receipt details status.
 */
export function ReceiptDetailsStatus({ receipt }: ReceiptDetailsStatusProps) {
  return (
    <Choose>
      <Choose.When condition={receipt.closed}>
        <Tag round={true} intent={Intent.SUCCESS}>
          <T id={'closed'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

export function ReceiptMoreMenuItems({ payload }: ReceiptMoreMenuItemsProps) {
  const { onNotifyViaSMS } = payload;

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
