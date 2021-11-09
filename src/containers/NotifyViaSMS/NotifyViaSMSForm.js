import React from 'react';
import { castArray } from 'lodash';
import { Formik, Form, useFormikContext } from 'formik';
import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';

import 'style/pages/NotifyConactViaSMS/NotifyConactViaSMSDialog.scss';

import { CreateNotifyViaSMSFormSchema } from './NotifyViaSMSForm.schema';
import NotifyViaSMSFormFields from './NotifyViaSMSFormFields';
import NotifyViaSMSFormFloatingActions from './NotifyViaSMSFormFloatingActions';
import { FormObserver, SMSMessagePreview } from 'components';

import { transformToForm, safeInvoke } from 'utils';
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
        <strong>Note</strong>: Note: One SMS unit can contain a maximum of 160
        characters. <strong>{messagesUnits}</strong> SMS units will be used to
        send this SMS notification.
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
      validationSchema={CreateNotifyViaSMSFormSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Form>
        <div className={Classes.DIALOG_BODY}>
          <NotifyContent>
            <NotifyFieldsSection>
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
