import { Form } from 'formik';
import React from 'react';
import { InventoryAdjustmentFloatingActions } from './InventoryAdjustmentFloatingActions';
import { InventoryAdjustmentFormDialogFields } from './InventoryAdjustmentFormDialogFields';

export function InventoryAdjustmentFormContent(): React.ReactElement {
  return (
    <Form>
      <InventoryAdjustmentFormDialogFields />
      <InventoryAdjustmentFloatingActions />
    </Form>
  );
}
