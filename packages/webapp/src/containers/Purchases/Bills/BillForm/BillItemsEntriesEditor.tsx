import { FastField } from 'formik';
import { useBillFormContext } from './BillFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import type { ItemEntry } from '@/interfaces/ItemEntries';
import { ItemsEntriesTable } from '@/containers/Entries/ItemsEntriesTable';
import { ITEM_TYPE } from '@/containers/Entries/utils';

type EntriesFieldRenderProps = {
  form: {
    values: { currencyCode: string };
    setFieldValue: (field: string, value: unknown) => void;
  };
  field: { value: ItemEntry[] | undefined };
  meta: { error?: unknown; touched?: boolean };
};

/**
 * Bill form body.
 */
export function BillFormBody() {
  const { items, taxRates } = useBillFormContext();

  return (
    <FastField
      name={'entries'}
      items={items}
      shouldUpdate={entriesFieldShouldUpdate}
    >
      {({ form, field, meta }: EntriesFieldRenderProps) => (
        <ItemsEntriesTable
          value={field.value}
          onChange={(entries: ItemEntry[]) => {
            form.setFieldValue('entries', entries);
          }}
          items={items}
          errors={meta.error}
          linesNumber={4}
          currencyCode={form.values.currencyCode}
          itemType={ITEM_TYPE.PURCHASABLE}
          taxRates={taxRates}
          landedCost={true}
        />
      )}
    </FastField>
  );
}
