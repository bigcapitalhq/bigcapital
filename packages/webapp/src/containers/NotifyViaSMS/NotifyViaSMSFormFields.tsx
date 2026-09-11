import { FormGroup, InputGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import { FastField, ErrorMessage } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { NotifyViaSMSNotificationType } from './NotifyViaSMSForm';
import type { FieldProps } from 'formik';
import { FFormGroup, FSelect, FieldRequiredHint } from '@/components';
import { CLASSES } from '@/constants/classes';
import { inputIntent } from '@/utils';

interface NotifyViaSMSFormFieldsProps {
  notificationTypes: NotifyViaSMSNotificationType[];
}

export function NotifyViaSMSFormFields({
  notificationTypes,
}: NotifyViaSMSFormFieldsProps) {
  return (
    <NotifyViaSMSFormFieldsRoot>
      <FFormGroup
        name={'notificationKey'}
        label={intl.get('notify_via_sms.dialog.notification_type')}
        className={classNames(CLASSES.FILL)}
        fastField
      >
        <FSelect
          name={'notificationKey'}
          items={notificationTypes}
          valueAccessor={'key'}
          textAccessor={'label'}
          popoverProps={{ minimal: true }}
          filterable={false}
          disabled={notificationTypes.length < 2}
          fastField
        />
      </FFormGroup>

      {/* ----------- Send Notification to ----------- */}
      <FastField name={'customerName'}>
        {({ field, meta: { error, touched } }: FieldProps) => (
          <FormGroup
            label={intl.get('notify_via_sms.dialog.send_notification_to')}
            className={classNames('form-group--customer-name', CLASSES.FILL)}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched }) || undefined}
            helperText={<ErrorMessage name={'customerName'} />}
          >
            <InputGroup
              intent={inputIntent({ error, touched }) || undefined}
              disabled={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Phone number ----------- */}
      <FastField name={'customerPhoneNumber'}>
        {({ field, meta: { error, touched } }: FieldProps) => (
          <FormGroup
            label={intl.get('phone_number')}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched }) || undefined}
            helperText={<ErrorMessage name="customerPhoneNumber" />}
            className={classNames(
              'form-group--customer_phone_number',
              CLASSES.FILL,
            )}
          >
            <InputGroup
              intent={inputIntent({ error, touched }) || undefined}
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
