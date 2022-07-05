import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from '@/common/classes';
import PaymentMadeEntriesTable from './PaymentMadeEntriesTable';

export default function PaymentMadeFormBody() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'entries'}>
        {({
          form: { setFieldValue, values },
          field: { value },
          meta: { error, touched },
        }) => (
          <PaymentMadeEntriesTable
            entries={value}
            onUpdateData={(newEntries) => {
              setFieldValue('entries', newEntries);
            }}
            currencyCode={values.currency_code}
          />
        )}
      </FastField>
    </div>
  );
}
