import React from 'react';
import { ExportDialogForm } from './ExportDialogForm';
import type { ExportFormInitialValues } from './type';

interface ExportDialogContentProps {
  initialValues?: ExportFormInitialValues;
}

/**
 * Account dialog content.
 */
export function ExportDialogContent({
  initialValues,
}: ExportDialogContentProps): React.ReactElement {
  return <ExportDialogForm initialValues={initialValues} />;
}
