import { chain } from 'lodash';
import React from 'react';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import type { WarehouseTransferFormValues } from './types';
import { FormikObserver } from '@/components';

export function WarehouseTransferObserveItemsCost() {
  const { setItemCostQuery } = useWarehouseTransferFormContext();

  // Handle the form change.
  const handleFormChange = (values: WarehouseTransferFormValues) => {
    const { date } = values;
    const itemsIds = chain(values.entries)
      .filter((e) => Boolean(e.itemId))
      .map((e) => e.itemId)
      .uniq()
      .value() as number[];

    setItemCostQuery({ date, itemsIds });
  };
  return <FormikObserver onChange={handleFormChange} />;
}
