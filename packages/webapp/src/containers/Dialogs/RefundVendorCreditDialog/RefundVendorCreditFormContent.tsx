import { Form } from 'formik';
import React from 'react';
import { RefundVendorCreditFloatingActions } from './RefundVendorCreditFloatingActions';
import { RefundVendorCreditFormFields } from './RefundVendorCreditFormFields';

export function RefundVendorCreditFormContent(): React.ReactElement {
  return (
    <Form>
      <RefundVendorCreditFormFields />
      <RefundVendorCreditFloatingActions />
    </Form>
  );
}
