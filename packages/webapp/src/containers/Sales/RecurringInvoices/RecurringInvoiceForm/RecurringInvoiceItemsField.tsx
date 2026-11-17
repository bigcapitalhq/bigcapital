import { x } from '@xstyled/emotion';
import { FastField } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringInvoiceFormContext } from './RecurringInvoiceFormProvider';
import { FFormGroup, FSelect } from '@/components';
import { Features } from '@/constants';
import { ItemsEntriesTable } from '@/containers/Entries/ItemsEntriesTable';
import { ITEM_TYPE } from '@/containers/Entries/utils';
import { useFeatureCan } from '@/hooks/state';
import { TaxType } from '@/interfaces/TaxRates';

const TAX_TYPE_OPTIONS = [
  { key: TaxType.Inclusive, label: 'Tax inclusive' },
  { key: TaxType.Exclusive, label: 'Tax exclusive' },
];

export function RecurringInvoiceItemsField() {
  const { items, taxRates } = useRecurringInvoiceFormContext();
  const { featureCan } = useFeatureCan();
  const isSalesTax = featureCan(Features.SalesTax);

  return (
    <x.div px={'32px'} pt={'18px'}>
      {isSalesTax && (
        <x.div display={'flex'} justifyContent={'flex-end'} mb={'10px'}>
          <FFormGroup
            name={'inclusiveExclusiveTax'}
            label={intl.get('recurring_invoice.field.amounts_are')}
            inline
            fastField
          >
            <FSelect
              name={'inclusiveExclusiveTax'}
              items={TAX_TYPE_OPTIONS}
              valueAccessor={'key'}
              textAccessor={'label'}
              popoverProps={{ minimal: true }}
              buttonProps={{ small: true }}
            />
          </FFormGroup>
        </x.div>
      )}

      <FastField name={'entries'} items={items} taxRates={taxRates}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error },
        }: any) => (
          <ItemsEntriesTable
            value={value}
            onChange={(entries) => setFieldValue('entries', entries)}
            items={items}
            taxRates={isSalesTax ? taxRates : []}
            itemType={ITEM_TYPE.SELLABLE}
            errors={error}
            linesNumber={4}
            currencyCode={values.currencyCode}
            isInclusiveTax={values.inclusiveExclusiveTax === TaxType.Inclusive}
          />
        )}
      </FastField>
    </x.div>
  );
}
