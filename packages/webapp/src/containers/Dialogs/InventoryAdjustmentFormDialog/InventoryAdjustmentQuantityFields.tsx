import { useFormikContext } from 'formik';
import React from 'react';
import { DecrementAdjustmentFields } from './DecrementAdjustmentFields';
import { IncrementAdjustmentFields } from './IncrementAdjustmentFields';
import type { InventoryAdjustmentFormValues } from './types';
import { Choose } from '@/components';

export function InventoryAdjustmentQuantityFields(): React.ReactElement {
  const { values } = useFormikContext<InventoryAdjustmentFormValues>();

  return (
    <div className="adjustment-fields">
      <Choose>
        <Choose.When condition={values.type === 'decrement'}>
          <DecrementAdjustmentFields />
        </Choose.When>
        <Choose.When condition={values.type === 'increment'}>
          <IncrementAdjustmentFields />
        </Choose.When>
      </Choose>
    </div>
  );
}
