import React from 'react';
import styled from 'styled-components';
import { Card, FormattedMessage as T } from 'components';
import { ItemManuTransaction } from './utils';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import ItemPaymentTransactionContent from './ItemPaymentTransactionContent';

export const ItemPaymentTransactions = () => {
  const { value } = useItemDetailDrawerContext();

  return (
    <Card>
      <ItemManuTransactions>
        <T id={'item.drawer_transactions_by'} />
        <ItemManuTransaction />
      </ItemManuTransactions>
      <ItemPaymentTransactionContent tansactionType={value} />
    </Card>
  );
};

const ItemManuTransactions = styled.div`
  display: flex;
  align-items: center;
  color: #727983;
  .bp3-button {
    padding-left: 6px;
    font-weight: 700;
  }
`;
