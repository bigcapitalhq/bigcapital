// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import MoneyOutFormFields from './MoneyOutFormFields';
import MoneyOutFormDialog from './MoneyOutFormDialog';
import MoneyOutFloatingActions from './MoneyOutFloatingActions';
import { MoneyInOutSyncIncrementSettingsToForm } from '../_components';

/**
 * Money out form content.
 */
export default function MoneyOutFormContent() {
  return (
    <Form>
      <MoneyOutFormFields />
      <MoneyOutFormDialog />
      <MoneyOutFloatingActions />
      <MoneyInOutSyncIncrementSettingsToForm />
    </Form>
  );
}
