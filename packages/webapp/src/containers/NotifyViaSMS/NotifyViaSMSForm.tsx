// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { castArray, includes } from 'lodash';
import { Formik, Form, useFormikContext } from 'formik';
import styled from 'styled-components';
import { Callout, Classes, Intent } from '@blueprintjs/core';

import '@/style/pages/NotifyContactViaSMS/NotifyContactViaSMSDialog.scss';

import { CreateNotifyViaSMSFormSchema } from './NotifyViaSMSForm.schema';
import NotifyViaSMSFormFields from './NotifyViaSMSFormFields';
import NotifyViaSMSFormFloatingActions from './NotifyViaSMSFormFloatingActions';
import { FormObserver, SMSMessagePreview } from '@/components';

import { transformToForm, safeInvoke } from '@/utils';
import { getSMSUnits } from './utils';


const defaultInitialValues = {
  notification_key: '',
  customer_name: '',
  customer_phone_number: '',
  sms_message: '',
};

/**
 * Notify via sms - SMS message preview section.
 */
function SMSMessagePreviewSection() {
  const {
    values: { sms_message },
  } = useFormikContext();

  // Calculates the SMS units of message.
  const messagesUnits = getSMSUnits(sms_message);

  return (
    <SMSPreviewSectionRoot>
      <SMSMessagePreview message={sms_message} />
      <SMSPreviewSectionNote>
        {intl.formatHTMLMessage(
          { id: 'notify_via_sms.dialog.sms_note' },
          {
            value: messagesUnits,
          },
        )}
      </SMSPreviewSectionNote>
    </SMSPreviewSectionRoot>
  );
}

/**
 * Notify Via SMS Form.
 */
function NotifyViaSMSForm({
  initialValues: initialValuesComponent,
  notificationTypes,
  onSubmit,
  onCancel,
  onValuesChange,
  calloutCodes,
  formikProps,
}) {
  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...transformToForm(initialValuesComponent, defaultInitialValues),
  };
  // Ensure always returns array.
  const formattedNotificationTypes = React.useMemo(
    () => castArray(notificationTypes),
    [notificationTypes],
  );

  return (
    <Formik
      enableReinitialize={true}
      validationSchema={CreateNotifyViaSMSFormSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Form>
        <div className={Classes.DIALOG_BODY}>
          <NotifyContent>
            <NotifyFieldsSection>
              <NotifyViaSMSAlerts calloutCodes={calloutCodes} />
              <NotifyViaSMSFormFields
                notificationTypes={formattedNotificationTypes}
              />
            </NotifyFieldsSection>

            <SMSMessagePreviewSection />
          </NotifyContent>
        </div>

        <NotifyViaSMSFormFloatingActions onCancel={onCancel} />
        <NotifyObserveValuesChange onChange={onValuesChange} />
      </Form>
    </Formik>
  );
}

/**
 * Observes the values change of notify form.
 */
function NotifyObserveValuesChange({ onChange }) {
  const { values } = useFormikContext();

  // Handle the form change observe.
  const handleChange = () => {
    safeInvoke(onChange, values);
  };
  return <FormObserver values={values} onChange={handleChange} />;
}

/**
 * Notify via SMS form alerts.
 */
function NotifyViaSMSAlerts({ calloutCodes }) {
  return [
    includes(calloutCodes, 100) && (
      <Callout icon={null} intent={Intent.DANGER}>
        {intl.get('notify_Via_sms.dialog.customer_phone_number_does_not_exist')}
      </Callout>
    ),
    includes(calloutCodes, 200) && (
      <Callout icon={null} intent={Intent.DANGER}>
        {intl.get('notify_Via_sms.dialog.customer_phone_number_invalid')}
      </Callout>
    ),
  ];
}

export default NotifyViaSMSForm;

const NotifyContent = styled.div`
  display: flex;
`;

const NotifyFieldsSection = styled.div`
  flex: 1;
  width: 65%;
`;

const SMSPreviewSectionRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  padding-left: 25px;
  margin-left: 25px;
  border-left: 1px solid #dcdcdd;
`;

const SMSPreviewSectionNote = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;
