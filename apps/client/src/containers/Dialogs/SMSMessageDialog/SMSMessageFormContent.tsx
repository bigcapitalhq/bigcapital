// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Form, useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';
import { castArray } from 'lodash';

import SMSMessageFormFields from './SMSMessageFormFields';
import SMSMessageFormFloatingActions from './SMSMessageFormFloatingActions';

import { useSMSMessageDialogContext } from './SMSMessageDialogProvider';
import { SMSMessagePreview } from '@/components';
import { getSMSUnits } from '@/containers/NotifyViaSMS/utils';

/**
 * SMS message form content.
 */
export default function SMSMessageFormContent() {
  // SMS message dialog context.
  const { smsNotification } = useSMSMessageDialogContext();

  // Ensure always returns array.
  const messageVariables = React.useMemo(
    () => castArray(smsNotification.allowed_variables),
    [smsNotification.allowed_variables],
  );

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <FormContent>
          <FormFields>
            <SMSMessageFormFields />
            <SMSMessageVariables>
              {messageVariables.map(({ variable, description }) => (
                <MessageVariable>
                  <strong>{`{${variable}}`}</strong> {description}
                </MessageVariable>
              ))}
            </SMSMessageVariables>
          </FormFields>

          <FormPreview>
            <SMSMessagePreviewSection />
          </FormPreview>
        </FormContent>
      </div>
      <SMSMessageFormFloatingActions />
    </Form>
  );
}

/**
 * SMS Message preview section.
 * @returns {JSX}
 */
function SMSMessagePreviewSection() {
  const {
    values: { message_text: message },
  } = useFormikContext();

  const messagesUnits = getSMSUnits(message);

  return (
    <SMSPreviewSectionRoot>
      <SMSMessagePreview message={message} />
      <SMSPreviewSectionNote>
        {intl.formatHTMLMessage(
          { id: 'sms_message.dialog.sms_note' },
          {
            value: messagesUnits,
          },
        )}
      </SMSPreviewSectionNote>
    </SMSPreviewSectionRoot>
  );
}

const SMSPreviewSectionRoot = styled.div``;

const SMSPreviewSectionNote = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const SMSMessageVariables = styled.div`
  list-style: none;
  font-size: 12px;
  opacity: 0.9;
`;

const MessageVariable = styled.div`
  margin-bottom: 8px;
`;

const FormContent = styled.div`
  display: flex;
`;

const FormFields = styled.div`
  width: 55%;
`;

const FormPreview = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  padding-left: 25px;
  margin-left: 25px;
  border-left: 1px solid #dcdcdd;
`;
