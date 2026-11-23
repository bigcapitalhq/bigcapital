import React from 'react';
import '@/style/pages/Preferences/trackingCategories.scss';
import { TrackingCategoryForm } from './TrackingCategoryForm';
import { TrackingCategoryFormProvider } from './TrackingCategoryFormProvider';

interface TrackingCategoryFormDialogContentProps {
  dialogName: string;
  categoryId?: number | null;
}

/**
 * Tracking category form dialog content.
 */
export function TrackingCategoryFormDialogContent({
  dialogName,
  categoryId,
}: TrackingCategoryFormDialogContentProps): React.ReactElement {
  return (
    <TrackingCategoryFormProvider
      dialogName={dialogName}
      categoryId={categoryId}
    >
      <TrackingCategoryForm />
    </TrackingCategoryFormProvider>
  );
}
