import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormattedMessage as T } from 'components';

import { useAutofocus } from 'hooks';
import {
  Classes,
  FormGroup,
  TextArea,
  Intent,
  InputGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { inputIntent } from 'utils';
import { FieldRequiredHint } from 'components';

import { useNotifyContactViaSMSContext } from './NotifyContactViaSMSFormProvider';

/**
 * Notify contact via SMS fields.
 */
function NotifyContactViaSMSFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/* ----------- Send Notification to ----------- */}
      <FastField name={'customer_name'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'notify_via_sms.dialog.send_notification_to'} />}
            className={classNames('form-group--customer-name', CLASSES.FILL)}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'customer_name'} />}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              disabled={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Phone number ----------- */}
      <FastField name={'customer_personal_phone'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'phone_number'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="customer_personal_phone" />}
            className={classNames(
              'form-group--customer_personal_phone',
              CLASSES.FILL,
            )}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              disabled={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Message Text ----------- */}
      <FastField name={'sms_message'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'notify_via_sms.dialog.message_text'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--sms_message'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'sms_message'} />}
          >
            <TextArea
              growVertically={true}
              large={true}
              disabled={true}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default NotifyContactViaSMSFormFields;
