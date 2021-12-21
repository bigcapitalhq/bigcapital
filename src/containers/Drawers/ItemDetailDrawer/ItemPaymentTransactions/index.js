import React from 'react';
import { Card } from 'components';
import { ItemManuTransaction } from './utils';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import ItemPaymentTransactionContent from './ItemPaymentTransactionContent';

export const ItemPaymentTransactions = () => {
  const { value, setValue } = useItemDetailDrawerContext();

  // handle item change.
  const handleItemChange = (item) => {
    setValue(item);
  };

  return (
    <Card>
      <ItemManuTransaction onChange={handleItemChange} />
      <ItemPaymentTransactionContent tansactionType={value} />
    </Card>
  );
};

