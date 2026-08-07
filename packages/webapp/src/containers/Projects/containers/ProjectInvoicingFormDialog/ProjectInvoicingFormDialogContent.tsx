// @ts-nocheck
import React from 'react';
import { ProjectInvoicingForm } from './ProjectInvoicingForm';
import { ProjectInvoicingFormProvider } from './ProjectInvoicingFormProvider';

/**
 * Project Invoicing form dialog content.
 * @returns
 */
export function ProjectInvoicingFormDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <ProjectInvoicingFormProvider dialogName={dialogName}>
      <ProjectInvoicingForm />
    </ProjectInvoicingFormProvider>
  );
}
