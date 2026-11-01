import React from 'react';
import styled from 'styled-components';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { ItemPaymentTransactionsContent as ItemPaymentTransactionContent } from './ItemPaymentTransactionContent';
import { ItemManuTransaction } from './utils';
import { Card } from '@/components';

export function ItemPaymentTransactions() {
  const { value } = useItemDetailDrawerContext();

  return (
    <Card>
      <ItemTransactionsHeader />
      <ItemPaymentTransactionContent transactionType={value} />
    </Card>
  );
}

/**
 * Item transactions header.
 */
export function ItemTransactionsHeader() {
  const { setValue } = useItemDetailDrawerContext();

  const handleItemChange = (item: string) => {
    setValue(item);
  };
  return (
    <ItemTransactionsHeaderRoot>
      <ItemManuTransaction onChange={handleItemChange} />
    </ItemTransactionsHeaderRoot>
  );
}

export const ItemTransactionsHeaderRoot = styled.div`
  margin-bottom: 10px;
`;
