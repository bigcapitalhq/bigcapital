// @ts-nocheck
import { Form } from 'formik';
import React from 'react';
import { ProjectInvoicingFormFields } from './ProjectInvoicingFormFields';
import { ProjectInvoicingFormFloatingActions } from './ProjectInvoicingFormFloatingActions';

/**
 * Project Invoicing form content.
 */
export function ProjectInvoicingFormContent() {
  return (
    <Form>
      <ProjectInvoicingFormFields />
      <ProjectInvoicingFormFloatingActions />
    </Form>
  );
}
