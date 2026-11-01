import classNames from 'classnames';
import { FastField } from 'formik';
import React from 'react';
import { PaymentMadeEntriesTable } from './PaymentMadeEntriesTable';
import type { PaymentMadeEntry, PaymentMadeFormValues } from './utils';
import { CLASSES } from '@/constants/classes';

export function PaymentMadeFormBody() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'entries'}>
        {({
          form: { setFieldValue, values },
          field: { value },
        }: {
          form: {
            setFieldValue: (field: string, val: unknown) => void;
            values: PaymentMadeFormValues;
          };
          field: { value: PaymentMadeEntry[] };
        }) => (
          <PaymentMadeEntriesTable
            entries={value}
            onUpdateData={(newEntries: PaymentMadeEntry[]) => {
              setFieldValue('entries', newEntries);
            }}
            currencyCode={values.currencyCode}
          />
        )}
      </FastField>
    </div>
  );
}
