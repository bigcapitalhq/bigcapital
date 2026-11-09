import { Form } from 'formik';
import React from 'react';
import { MoneyInOutSyncIncrementSettingsToForm } from '../_components';
import { MoneyOutFloatingActions } from './MoneyOutFloatingActions';
import { MoneyOutFormDialog } from './MoneyOutFormDialog';
import { MoneyOutFormFields } from './MoneyOutFormFields';

/**
 * Money out form content.
 */
export function MoneyOutFormContent() {
  return (
    <Form>
      <MoneyOutFormFields />
      <MoneyOutFormDialog />
      <MoneyOutFloatingActions />
      <MoneyInOutSyncIncrementSettingsToForm />
    </Form>
  );
}
