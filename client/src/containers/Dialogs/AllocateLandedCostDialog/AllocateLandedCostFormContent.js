import React from 'react';
import { Form } from 'formik';
import AllocateLandedCostFormFields from './AllocateLandedCostFormFields';
import AllocateLandedCostFloatingActions from './AllocateLandedCostFloatingActions';
/**
 * Allocate landed cost form content.
 */
export default function AllocateLandedCostFormContent() {
  return (
    <Form>
      <AllocateLandedCostFormFields />
      <AllocateLandedCostFloatingActions />
    </Form>
  );
}
