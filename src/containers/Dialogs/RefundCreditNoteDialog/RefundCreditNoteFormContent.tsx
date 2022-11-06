// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import RefundCreditNoteFormFields from './RefundCreditNoteFormFields';
import RefundCreditNoteFloatingActions from './RefundCreditNoteFloatingActions';

/**
 * Refund credit note form content.
 */
export default function RefundCreditNoteFormContent() {
  return (
    <Form>
      <RefundCreditNoteFormFields />
      <RefundCreditNoteFloatingActions />
    </Form>
  );
}
