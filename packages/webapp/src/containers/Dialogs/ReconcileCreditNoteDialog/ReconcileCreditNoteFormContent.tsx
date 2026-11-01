import { Form } from 'formik';
import React from 'react';
import { ReconcileCreditNoteFormFields } from './ReconcileCreditNoteFormFields';
import { ReconcileCreditNoteFormFloatingActions } from './ReconcileCreditNoteFormFloatingActions';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import { EmptyStatuCallout } from './utils';
import { Choose } from '@/components';

/**
 * Reconcile credit note form content.
 */
export function ReconcileCreditNoteFormContent(): React.ReactElement {
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
