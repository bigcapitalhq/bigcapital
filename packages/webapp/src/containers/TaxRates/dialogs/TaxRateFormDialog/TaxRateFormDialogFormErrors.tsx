// @ts-nocheck
import React from 'react';
import { Alert } from '@/components';
import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';

export function TaxRateFormDialogFormErrors() {
  const { errors } = useFormikContext();

  if (!errors.confirm_edit) return null;

  return <Alert intent={Intent.DANGER}>{errors.confirm_edit}</Alert>;
}
