// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import { CustomFieldsFormHeader } from './CustomFieldsFormHeader';
import { CustomFieldsFormFloatingActions } from './CustomFieldsFormFloatingActions';

/**
 * Preferences - Custom Fields Form content.
 * @returns {React.JSX}
 */
export default function CustomFieldsFormContent() {
  return (
    <Form>
      <CustomFieldsFormHeader />
      <CustomFieldsFormFloatingActions />
    </Form>
  );
}
