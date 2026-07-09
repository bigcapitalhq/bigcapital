import { Form } from 'formik';
import React from 'react';
import { WarehouseFormFields } from './WarehouseFormFields';
import { WarehouseFormFloatingActions } from './WarehouseFormFloatingActions';

export function WarehouseFormContent(): React.ReactElement {
  return (
    <Form>
      <WarehouseFormFields />
      <WarehouseFormFloatingActions />
    </Form>
  );
}
