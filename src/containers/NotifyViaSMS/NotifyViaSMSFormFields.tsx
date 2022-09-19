// @ts-nocheck
import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import styled from 'styled-components';

import {
  ListSelect,
  FieldRequiredHint,
  FormattedMessage as T,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { inputIntent } from '@/utils';

export default function NotifyViaSMSFormFields({ notificationTypes }) {
  return (
    <NotifyViaSMSFormFieldsRoot>
      <FastField name={'notification_key'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'notify_via_sms.dialog.notification_type'} />}
            className={classNames(CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'customer_name'} />}
          >
            <ListSelect
              items={notificationTypes}
              selectedItemProp={'key'}
              selectedItem={value}
              textProp={'label'}
              popoverProps={{ minimal: true }}
              filterable={false}
              onItemSelect={(notification) => {
                form.setFieldValue('notification_key', notification.key);
              }}
              disabled={notificationTypes.length < 2}
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
    </NotifyViaSMSFormFieldsRoot>
  );
}

const NotifyViaSMSFormFieldsRoot = styled.div``;
