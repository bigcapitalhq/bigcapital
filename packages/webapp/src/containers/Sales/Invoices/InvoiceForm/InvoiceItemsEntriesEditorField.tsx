import { FastField } from 'formik';
import React from 'react';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import type { InvoiceFormValues } from './utils';
import type { FieldProps } from 'formik';
import { Features } from '@/constants';
import { ItemsEntriesTable } from '@/containers/Entries/ItemsEntriesTable';
import { ITEM_TYPE } from '@/containers/Entries/utils';
import { useFeatureCan } from '@/hooks/state';
import { TaxType } from '@/interfaces/TaxRates';

/**
 * Invoice items entries editor field.
 */
export function InvoiceItemsEntriesEditorField() {
  const { items, taxRates, invoice } = useInvoiceFormContext();
  const { featureCan } = useFeatureCan();
  const isBatchTrackingEnabled = featureCan(Features.BatchTracking);

  return (
    <FastField
      name={'entries'}
      items={items}
      taxRates={taxRates}
      shouldUpdate={entriesFieldShouldUpdate}
    >
      {({
        form: { values, setFieldValue },
        field: { value },
        meta: { error },
      }: FieldProps<any[], InvoiceFormValues>) => (
        <ItemsEntriesTable
          value={value}
          onChange={(entries) => {
            setFieldValue('entries', entries);
          }}
          items={items}
          taxRates={taxRates}
          itemType={ITEM_TYPE.SELLABLE}
          errors={error}
          linesNumber={4}
          currencyCode={values.currencyCode}
          isInclusiveTax={values.inclusiveExclusiveTax === TaxType.Inclusive}
          batchMode={isBatchTrackingEnabled ? 'sale' : undefined}
          warehouseId={values.warehouseId}
          batchAvailabilityAdjustment={(batchId, rowIndex, warehouseId) => {
            const posted = invoice?.isDelivered ? invoice.entries : [];
            const reserved = values.entries.filter(
              (_, index) => index !== rowIndex,
            );
            return (
              allocatedInWarehouse(
                posted,
                batchId,
                invoice?.warehouseId,
                warehouseId,
              ) -
              allocatedInWarehouse(
                reserved,
                batchId,
                values.warehouseId,
                warehouseId,
              )
            );
          }}
        />
      )}
    </FastField>
  );
}

function allocatedInWarehouse(
  entries: Array<{
    warehouseId?: number | string;
    batchId?: number | null;
    quantity: number | string;
    batches?: { batchId: number; quantity: number }[];
  }>,
  batchId: number,
  documentWarehouse?: number | string,
  selectedWarehouse?: number | string,
): number {
  return entries.reduce((sum, entry) => {
    if (
      selectedWarehouse &&
      Number(entry.warehouseId || documentWarehouse) !==
        Number(selectedWarehouse)
    )
      return sum;
    if (entry.batches?.length) {
      return (
        sum +
        entry.batches.reduce(
          (total, allocation) =>
            total +
            (Number(allocation.batchId) === batchId
              ? Number(allocation.quantity)
              : 0),
          0,
        )
      );
    }
    return (
      sum + (Number(entry.batchId) === batchId ? Number(entry.quantity) : 0)
    );
  }, 0);
}
