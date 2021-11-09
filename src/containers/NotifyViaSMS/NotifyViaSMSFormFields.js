import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import classNames from 'classnames';

import {
  ListSelect,
  FieldRequiredHint,
  FormattedMessage as T,
} from 'components';
import { CLASSES } from 'common/classes';
import { inputIntent } from 'utils';

const notificationTypes = [
  { key: 'details', label: 'Invoice details' },
  { key: 'reminder', label: 'Invoice reminder' },
];

export default function NotifyViaSMSFormFields() {
  return (
    <div>
      <FastField name={'notification_key'}>
        {({ form, meta: { error, touched } }) => (
          <FormGroup
            label={'Notification type'}
            className={classNames(CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'customer_name'} />}
          >
            <ListSelect
              items={notificationTypes}
              selectedItemProp={'key'}
              selectedItem={'details'}
              textProp={'label'}
              popoverProps={{ minimal: true }}
              filterable={false}
              onItemSelect={(notification) => {
                form.setFieldValue('notification_key', notification.key);
              }}
            />
          </FormGroup>
        )}
      </FastField>

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
      <FastField name={'customer_phone_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'phone_number'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="customer_phone_number" />}
            className={classNames(
              'form-group--customer_phone_number',
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
    </div>
  );
}
