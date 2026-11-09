import {
  Button,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { FormattedMessage as T } from '@/components';
import { useGetItemPaymentTransactionsMenu } from '@/constants/itemPaymentTranactionsOption';

interface ItemManuTransactionProps {
  onChange?: (value: string) => void;
}

export const ItemManuTransaction = ({ onChange }: ItemManuTransactionProps) => {
  const { value } = useItemDetailDrawerContext();
  const itemTransactionMenu = useGetItemPaymentTransactionsMenu();

  if (itemTransactionMenu.length === 0) {
    return null;
  }
  const handleClickItem = (item: string) => {
    onChange && onChange(item);
  };
  const content = itemTransactionMenu.map(
    ({ name, label }: { name: string; label: React.ReactNode }) => (
      <MenuItem onClick={() => handleClickItem(name)} text={label} />
    ),
  );

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

ItemManuTransaction.displayName = 'ItemManuTransaction';

const ItemSwitchButton = styled(Button)`
  --button-text-color: #727983;

  .bp4-dark & {
    --button-text-color: rgba(255, 255, 255, 0.65);
  }
  .bp4-button-text {
    display: flex;
    color: var(--button-text-color);
  }
`;

const ItemSwitchText = styled.span`
  --button-text-color: #33304a;

  .bp4-dark & {
    --button-text-color: rgba(255, 255, 255, 0.85);
  }
  font-weight: 600;
  color: var(--button-text-color);
  padding-left: 3px;
`;
