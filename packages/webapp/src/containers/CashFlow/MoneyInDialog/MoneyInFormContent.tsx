// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import MoneyInFormFields from './MoneyInFormFields';
import MoneyInFormDialog from './MoneyInFormDialog';
import MoneyInFloatingActions from './MoneyInFloatingActions';
import { MoneyInOutSyncIncrementSettingsToForm } from '../_components';

/**
 * Money In form content.
 */
export default function MoneyInFormContent() {
  return (
    <Form>
      <MoneyInFormFields />
      <MoneyInFormDialog />
      <MoneyInFloatingActions />
      <MoneyInOutSyncIncrementSettingsToForm />
    </Form>
  );
}
