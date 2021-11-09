import React from 'react';
import { Form, useFormikContext } from 'formik';
import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';

import SMSMessageFormFields from './SMSMessageFormFields';
import SMSMessageFormFloatingActions from './SMSMessageFormFloatingActions';

import { SMSMessagePreview } from 'components';
import { getSMSUnits } from '../../NotifyViaSMS/utils';

const messageVariables = [
  {
    variable: '{CompanyName}',
    description: 'References to the current company name.',
  },
];

/**
 * SMS message form content.
 */
export default function SMSMessageFormContent() {
  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <FormContent>
          <FormFields>
            <SMSMessageFormFields />

            <SMSMessageVariables>
              {messageVariables.map(({ variable, description }) => (
                <MessageVariable>
                  <strong>{variable}</strong> {description}
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
        <strong>Note</strong>: Note: One SMS unit can contain a maximum of 160
        characters. <strong>{messagesUnits}</strong> SMS units will be used to
        send this SMS notification.
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
