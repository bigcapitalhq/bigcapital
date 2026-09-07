import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FInputGroup, FFormGroup, FSelect, FieldRequiredHint } from '@/components';
import { CLASSES } from '@/constants/classes';
import type { NotificationType } from './NotifyViaSMSForm';

interface NotifyViaSMSFormFieldsProps {
  notificationTypes: NotificationType[];
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
      <FFormGroup
        name={'customerName'}
        label={intl.get('notify_via_sms.dialog.send_notification_to')}
        labelInfo={<FieldRequiredHint />}
        className={classNames('form-group--customer-name', CLASSES.FILL)}
        fastField
      >
        <FInputGroup name={'customerName'} disabled fastField />
      </FFormGroup>

      {/* ----------- Phone number ----------- */}
      <FFormGroup
        name={'customerPhoneNumber'}
        label={intl.get('phone_number')}
        labelInfo={<FieldRequiredHint />}
        className={classNames(
          'form-group--customer_phone_number',
          CLASSES.FILL,
        )}
        fastField
      >
        <FInputGroup name={'customerPhoneNumber'} disabled fastField />
      </FFormGroup>
    </NotifyViaSMSFormFieldsRoot>
  );
}

const NotifyViaSMSFormFieldsRoot = styled.div``;
