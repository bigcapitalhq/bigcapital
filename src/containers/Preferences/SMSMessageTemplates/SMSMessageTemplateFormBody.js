import React from 'react';
import { FastField } from 'formik';

import SMSMessageTemplatesEntriesTable from './SMSMessageTemplatesEntriesTable';

export default function SMSMessageTemplateFormBody() {
  return (
    <FastField name={'entries'}>
      {({
        form: { values, setFieldValue },
        field: { value },
        meta: { error, touched },
      }) => (
        <SMSMessageTemplatesEntriesTable
          entries={value}
          onUpdateData={(newEntries) => {
            setFieldValue('entries', newEntries);
          }}
        />
      )}
    </FastField>
  );
}
