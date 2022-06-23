//@ts-nocheck
import React from 'react';
import {
  MenuItem,
  Button,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { Icon, FormattedMessage as T } from 'components';

/**
 *
 * @param {*} film
 * @param {*} param1
 * @returns
 */
const transactionItemRenderer = (
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

const transactionSelectProps = {
  itemRenderer: transactionItemRenderer,
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
 *
 * @param
 * @returns
 */
export function TransactionSelect({ transactions, ...rest }) {
  return (
    <Select {...transactionSelectProps} items={transactions} {...rest}>
      <Button
        minimal={true}
        icon={<Icon icon={'plus'} />}
        text={<T id={'projcet_details.action.new_transaction'} />}
      />
    </Select>
  );
}
