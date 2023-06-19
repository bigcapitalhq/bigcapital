// @ts-nocheck
import React from 'react';
import {
  MenuItem,
  Button,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { Icon, FormattedMessage as T } from '@/components';

/**
 *
 * @param {*} film
 * @param {*} param1
 * @returns
 */
const projectTransactionItemRenderer = (
  transaction,
  { handleClick, modifiers, query },
) => {
  return (
    <MenuItem
      disabled={modifiers.disabled}
      key={transaction.path}
      onClick={handleClick}
      text={transaction.name}
    />
  );
};

const projectTransactionSelectProps = {
  itemRenderer: projectTransactionItemRenderer,
  filterable: false,
  popoverProps: {
    minimal: true,
    position: Position.BOTTOM_LEFT,
    interactionKind: PopoverInteractionKind.CLICK,
    modifiers: {
      offset: { offset: '0, 4' },
    },
  },
};

/**
 * Project transactions select
 * @param
 * @returns
 */
export function ProjectTransactionsSelect({ transactions, ...rest }) {
  return (
    <Select {...projectTransactionSelectProps} items={transactions} {...rest}>
      <Button
        minimal={true}
        icon={<Icon icon={'plus'} />}
        text={<T id={'project_details.action.new_transaction'} />}
      />
    </Select>
  );
}
