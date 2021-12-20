import React from 'react';
import {
  Button,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import transactions from '../../../../common/itemPaymentTranactionsOption';

export const ItemManuTransaction = () => {
  const { value, setValue } = useItemDetailDrawerContext();

  // const handleClickItem = (item) => {
  //   onChange && onChange(item);
  // };

  const content = transactions.map(({ name, label }) => (
    <MenuItem onClick={() => setValue(name)} text={label} />
  ));

  return (
    <Popover
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      content={<Menu>{content}</Menu>}
    >
      <Button minimal={true} text={<T id={value} />} rightIcon={'caret-down'} />
    </Popover>
  );
};
