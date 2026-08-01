import { Form } from 'formik';
import React from 'react';
import { ReconcileVendorCreditFloatingActions } from './ReconcileVendorCreditFloatingActions';
import { ReconcileVendorCreditFormFields } from './ReconcileVendorCreditFormFields';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import { EmptyStatuCallout } from './utils';
import { Choose } from '@/components';

export function ReconcileVendorCreditFormContent(): React.ReactElement {
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
