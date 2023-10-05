// @ts-nocheck
import ItemsEntriesTable from '@/containers/Entries/ItemsEntriesTable';
import { FastField } from 'formik';
import { useBillFormContext } from './BillFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import { ITEM_TYPE } from '@/containers/Entries/utils';

/**
 * Bill form body.
 */
export default function BillFormBody({ defaultBill }) {
  const { items, taxRates } = useBillFormContext();

  return (
    <FastField
      name={'entries'}
      items={items}
      shouldUpdate={entriesFieldShouldUpdate}
    >
      {({
        form: { values, setFieldValue },
        field: { value },
        meta: { error, touched },
      }) => (
        <ItemsEntriesTable
          value={value}
          onChange={(entries) => {
            setFieldValue('entries', entries);
          }}
          items={items}
          errors={error}
          linesNumber={4}
          currencyCode={values.currency_code}
          itemType={ITEM_TYPE.PURCHASABLE}
          taxRates={taxRates}
          landedCost={true}
        />
      )}
    </FastField>
  );
}
