// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import { Choose } from '@/components';

import { EmptyStatuCallout } from './utils';
import ReconcileVendorCreditFormFields from './ReconcileVendorCreditFormFields';
import ReconcileVendorCreditFloatingActions from './ReconcileVendorCreditFloatingActions';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';

export default function ReconcileVendorCreditFormContent() {
  const { isEmptyStatus } = useReconcileVendorCreditContext();

  return (
    <Choose>
      <Choose.When condition={isEmptyStatus}>
        <EmptyStatuCallout />
      </Choose.When>
      <Choose.Otherwise>
        <Form>
          <ReconcileVendorCreditFormFields />
          <ReconcileVendorCreditFloatingActions />
        </Form>
      </Choose.Otherwise>
    </Choose>
  );
}
