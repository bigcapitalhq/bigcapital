// @ts-nocheck
import React from 'react';
import { FastField } from 'formik';
import PaymentReceiveItemsTable from './PaymentReceiveItemsTable';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

/**
 * Payment Receive form body.
 */
export default function PaymentReceiveFormBody() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'entries'}>
        {({ form: { values, setFieldValue }, field: { value } }) => (
          <PaymentReceiveItemsTable
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
