import { Callout, Classes, Intent } from '@blueprintjs/core';
import { Formik, Form, useFormikContext } from 'formik';
import { castArray, includes } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import '@/style/pages/NotifyConactViaSMS/NotifyConactViaSMSDialog.scss';
import { CreateNotifyViaSMSFormSchema } from './NotifyViaSMSForm.schema';
import { NotifyViaSMSFormFields } from './NotifyViaSMSFormFields';
import { NotifyViaSMSFormFloatingActions } from './NotifyViaSMSFormFloatingActions';
import { getSMSUnits } from './utils';
import type { FormikHelpers } from 'formik';
import { FormObserver, SMSMessagePreview } from '@/components';
import { transformToForm } from '@/utils';

export interface NotifyViaSMSFormValues {
  notificationKey: string;
  customerName: string;
  customerPhoneNumber: string;
  smsMessage: string;
}

export interface NotifyViaSMSNotificationType {
  key: string;
  label: string;
}

export interface NotifyViaSMSFormProps {
  initialValues?: Partial<NotifyViaSMSFormValues>;
  notificationTypes?:
    | NotifyViaSMSNotificationType
    | NotifyViaSMSNotificationType[];
  onSubmit?: (
    values: NotifyViaSMSFormValues,
    helpers: FormikHelpers<NotifyViaSMSFormValues>,
  ) => void;
  onCancel?: () => void;
  onValuesChange?: (values: NotifyViaSMSFormValues) => void;
  calloutCodes?: number[];
  formikProps?: Record<string, unknown>;
}

const defaultInitialValues: NotifyViaSMSFormValues = {
  notificationKey: '',
  customerName: '',
  customerPhoneNumber: '',
  smsMessage: '',
};

/**
 * Notify via sms - SMS message preview section.
 */
function SMSMessagePreviewSection() {
  const {
    values: { smsMessage },
  } = useFormikContext<NotifyViaSMSFormValues>();

  // Calculates the SMS units of message.
  const messagesUnits = getSMSUnits(smsMessage);

  return (
    <SMSPreviewSectionRoot>
      <SMSMessagePreview message={smsMessage} />
      <SMSPreviewSectionNote>
        {intl.formatHTMLMessage(
          { id: 'notiify_via_sms.dialog.sms_note' },
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
export function NotifyViaSMSForm({
  initialValues: initialValuesComponent,
  notificationTypes,
  onSubmit,
  onCancel,
  onValuesChange,
  calloutCodes,
}: NotifyViaSMSFormProps) {
  // Initial form values
  const initialValues: NotifyViaSMSFormValues = {
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
      onSubmit={(values, helpers) => onSubmit?.(values, helpers)}
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

interface NotifyObserveValuesChangeProps {
  onChange?: (values: NotifyViaSMSFormValues) => void;
}

/**
 * Observes the values change of notify form.
 */
function NotifyObserveValuesChange({
  onChange,
}: NotifyObserveValuesChangeProps) {
  const { values } = useFormikContext<NotifyViaSMSFormValues>();

  // Handle the form change observe.
  const handleChange = () => {
    onChange?.(values);
  };
  return <FormObserver values={values} onChange={handleChange} />;
}

interface NotifyViaSMSAlertsProps {
  calloutCodes?: number[];
}

/**
 * Notify via SMS form alerts.
 */
function NotifyViaSMSAlerts({ calloutCodes }: NotifyViaSMSAlertsProps) {
  return (
    <>
      {includes(calloutCodes, 100) && (
        <Callout icon={null} intent={Intent.DANGER}>
          {intl.get(
            'notify_Via_sms.dialog.customer_phone_number_does_not_eixst',
          )}
        </Callout>
      )}
      {includes(calloutCodes, 200) && (
        <Callout icon={null} intent={Intent.DANGER}>
          {intl.get('notify_Via_sms.dialog.customer_phone_number_invalid')}
        </Callout>
      )}
    </>
  );
}
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

  .bp4-dark & {
    border-left-color: var(--color-dark-gray5);
  }
`;

const SMSPreviewSectionNote = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;
