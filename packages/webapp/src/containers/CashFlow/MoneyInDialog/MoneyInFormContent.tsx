import { Form } from 'formik';
import React from 'react';
import { MoneyInOutSyncIncrementSettingsToForm } from '../_components';
import { MoneyInFloatingActions } from './MoneyInFloatingActions';
import { MoneyInFormDialog } from './MoneyInFormDialog';
import { MoneyInFormFields } from './MoneyInFormFields';

/**
 * Money In form content.
 */
export function MoneyInFormContent() {
  return (
    <Form>
      <MoneyInFormFields />
      <MoneyInFormDialog />
      <MoneyInFloatingActions />
      <MoneyInOutSyncIncrementSettingsToForm />
    </Form>
  );
}
