import { Form, useFormikContext } from 'formik';
import React from 'react';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import { AllocateLandedCostFloatingActions } from './AllocateLandedCostFloatingActions';
import { AllocateLandedCostFormFields } from './AllocateLandedCostFormFields';
import type { AllocateLandedCostFormValues } from './types';
import { FormObserver } from '@/components';

/**
 * Allocate landed cost form content.
 */
export function AllocateLandedCostFormContent() {
  const { values } = useFormikContext<AllocateLandedCostFormValues>();

  // Allocate landed cost dialog context.
  const { setTransactionsType, setTransactionId, setTransactionEntryId } =
    useAllocateLandedConstDialogContext();

  // Handle the form change.
  // FIXME: `transactionId` / `transactionEntryId` form values are typed as
  // `number | string` (schema Yup.string()) but the provider state setters are
  // `number | null`. Pass through unchanged to preserve original runtime behavior
  // (state may hold a string at runtime if the field is a string).
  const handleFormChange = (nextValues: AllocateLandedCostFormValues) => {
    if (nextValues.transactionType) {
      setTransactionsType(nextValues.transactionType);
    }
    if (nextValues.transactionId) {
      setTransactionId(nextValues.transactionId as unknown as number);
    }
    if (nextValues.transactionEntryId) {
      setTransactionEntryId(nextValues.transactionEntryId as unknown as number);
    }
  };
  return (
    <Form>
      <AllocateLandedCostFormFields />
      <AllocateLandedCostFloatingActions />
      <FormObserver values={values} onChange={handleFormChange} />
    </Form>
  );
}
