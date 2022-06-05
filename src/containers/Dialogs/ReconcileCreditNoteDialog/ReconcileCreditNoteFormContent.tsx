import React from 'react';
import { Form } from 'formik';
import { Choose } from 'components';

import ReconcileCreditNoteFormFields from './ReconcileCreditNoteFormFields';
import ReconcileCreditNoteFormFloatingActions from './ReconcileCreditNoteFormFloatingActions';
import { EmptyStatuCallout } from './utils';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';

/**
 * Reconcile credit note form content.
 */
export default function ReconcileCreditNoteFormContent() {
  const { isEmptyStatus } = useReconcileCreditNoteContext();
  return (
    <Choose>
      <Choose.When condition={isEmptyStatus}>
        <EmptyStatuCallout />
      </Choose.When>
      <Choose.Otherwise>
        <Form>
          <ReconcileCreditNoteFormFields />
          <ReconcileCreditNoteFormFloatingActions />
        </Form>
      </Choose.Otherwise>
    </Choose>
  );
}
