// @ts-nocheck
import React from 'react';
import { CustomerFormProvider } from './CustomerFormProvider';
import CustomerFormFormik from './CustomerFormFormik';

/**
 * Abstracted customer form.
 */
export default function CustomerForm({ customerId }) {
  return (
    <CustomerFormProvider customerId={customerId}>
      <CustomerFormFormik />
    </CustomerFormProvider>
  );
}
