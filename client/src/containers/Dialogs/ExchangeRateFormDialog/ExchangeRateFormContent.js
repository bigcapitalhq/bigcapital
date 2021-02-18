import React from 'react';
import { Form } from 'formik';
import ExchangeRateFormFields from './ExchangeRateFormFields';
import ExchangeRateFormFooter from './ExchangeRateFormFooter';

export default function ExchangeRateFormContent() {
  return (
    <Form>
      <ExchangeRateFormFields />
      <ExchangeRateFormFooter />
    </Form>
  );
}
