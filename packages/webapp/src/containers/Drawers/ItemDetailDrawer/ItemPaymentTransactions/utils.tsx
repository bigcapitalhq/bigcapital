// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import {
  Button,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { useGetItemPaymentTransactionsMenu } from '@/constants/itemPaymentTransactionsOption';

export const ItemManuTransaction = ({ onChange }) => {
  const { value, setValue } = useItemDetailDrawerContext();
  const itemTransactionMenu = useGetItemPaymentTransactionsMenu();

  if (itemTransactionMenu.length === 0) {
    return null;
  }

  const handleClickItem = (item) => {
    onChange && onChange(item);
  };

  const content = itemTransactionMenu.map(({ name, label }) => (
    <MenuItem onClick={() => handleClickItem(name)} text={label} />
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
      <ItemSwitchButton
        minimal={true}
        text={<T id={'item.drawer_transactions_by'} />}
        rightIcon={'caret-down'}
      >
        <ItemSwitchText>
          <T id={value} />
        </ItemSwitchText>
      </ItemSwitchButton>
    </Popover>
  );
};

const ItemSwitchButton = styled(Button)`
  .bp3-button-text {
    display: flex;
    color: #727983;
  }
`;

const ItemSwitchText = styled.span`
  font-weight: 600;
  color: #33304a;
  padding-left: 3px;
`;
