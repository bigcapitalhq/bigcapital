// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import CurrencyFormFields from './CurrencyFormFields';
import CurrencyFormFooter from './CurrencyFormFooter';

export default function CurrencyFormContent() {
  return (
    <Form>
      <CurrencyFormFields />
      <CurrencyFormFooter />
    </Form>
  );
}
