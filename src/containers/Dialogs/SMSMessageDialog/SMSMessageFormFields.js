import React from 'react';

import { FastField, Field, ErrorMessage } from 'formik';
import { Classes, FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T, FieldRequiredHint } from 'components';
import { inputIntent } from 'utils';

export default function SMSMessageFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/* ----------- Message Text ----------- */}
      <FastField name={'message_text'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'notify_via_sms.dialog.message_text'} />}
            className={'form-group--message_text'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'message_text'} />}
          >
            <TextArea
              growVertically={true}
              large={true}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
