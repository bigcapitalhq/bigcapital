import React from 'react';
import { FormikObserver } from 'components';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';

export function WarehouseTransferObserveItemsCost() {
  const { setItemCostQuery } = useWarehouseTransferFormContext();

  // Handle the form change.
  const handleFormChange = (values) => {
    const itemsIds = values.entries
      .filter((e) => e.item_id)
      .map((e) => e.item_id);

    setItemCostQuery({
      date: values.date,
      itemsIds,
    });
  };
  return <FormikObserver onChange={handleFormChange} />;
}
