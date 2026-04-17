// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { CustomFieldsFormProvider } from './CustomFieldsFormProvider';
import CustomFieldsForm from './CustomFieldsForm';

/**
 * Custom Fields Form page.
 */
export default function CustomFieldsFormPage() {
  const { id } = useParams();
  const idInteger = id ? parseInt(id, 10) : null;
  const isNewMode = !idInteger;

  return (
    <CustomFieldsFormProvider customFieldId={idInteger} isNewMode={isNewMode}>
      <CustomFieldsForm />
    </CustomFieldsFormProvider>
  );
}
