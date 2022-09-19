// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import InventoryAdjustmentFormDialogFields from './InventoryAdjustmentFormDialogFields';
import InventoryAdjustmentFloatingActions from './InventoryAdjustmentFloatingActions';

/**
 * Inventory adjustment form content.
 */
export default function InventoryAdjustmentFormContent() {
  return (
    <Form>
      <InventoryAdjustmentFormDialogFields />
      <InventoryAdjustmentFloatingActions />
    </Form>
  );
}
