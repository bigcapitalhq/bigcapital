// @ts-nocheck
import React from 'react';
import {
  Intent,
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Tag,
} from '@blueprintjs/core';

import { Icon, T, Choose } from '@/components';

/**
 * Estimate details status.
 * @return {React.JSX}
 */
export function EstimateDetailsStatus({ estimate }) {
  return (
    <Choose>
      <Choose.When condition={estimate.is_approved}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'approved'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={estimate.is_rejected}>
        <Tag intent={Intent.DANGER} round={true}>
          <T id={'rejected'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={estimate.is_expired}>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'estimate.status.expired'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={estimate.is_delivered}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'delivered'} />
        </Tag>
      </Choose.When>
      <Choose.Otherwise>
        <Tag round={true} minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

export function EstimateMoreMenuItems({ payload: { onNotifyViaSMS } }) {
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