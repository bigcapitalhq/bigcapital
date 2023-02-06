// @ts-nocheck
import React from 'react';

import { ProjectInvoicingFormProvider } from './ProjectInvoicingFormProvider';
import ProjectInvoicingForm from './ProjectInvoicingForm';

/**
 * Project Invoicing form dialog content.
 * @returns
 */
export default function ProjectInvoicingFormDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <ProjectInvoicingFormProvider dialogName={dialogName}>
      <ProjectInvoicingForm />
    </ProjectInvoicingFormProvider>
  );
}
