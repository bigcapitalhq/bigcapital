import React from 'react';
import { FastField } from 'formik';
import PaymentReceiveItemsTable from './PaymentReceiveItemsTable';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

/**
 * Payment Receive form body.
 */
export default function PaymentReceiveFormBody() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'entries'}>
        {({ form, field: { value } }) => (
          <PaymentReceiveItemsTable
            entries={value}
            onUpdateData={(newEntries) => {
              form.setFieldValue('entries', newEntries);
            }}
          />
        )}
      </FastField>
    </div>
  );
}
