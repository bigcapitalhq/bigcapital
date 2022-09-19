// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import WarehouseFormFields from './WarehouseFormFields';
import WarehouseFormFloatingActions from './WarehouseFormFloatingActions';

/**
 * Warehouse form content.
 * @returns
 */
export default function WarehouseFormContent() {
  return (
    <Form>
      <WarehouseFormFields />
      <WarehouseFormFloatingActions />
    </Form>
  );
}
