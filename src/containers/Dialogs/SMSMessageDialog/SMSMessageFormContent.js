import React from 'react';
import intl from 'react-intl-universal';
import { Form, useFormikContext } from 'formik';
import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';

import SMSMessageFormFields from './SMSMessageFormFields';
import SMSMessageFormFloatingActions from './SMSMessageFormFloatingActions';

import { SMSMessagePreview } from 'components';
import { getSMSUnits } from '../../NotifyViaSMS/utils';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

const messageVariables = [
  {
    variable: '{CompanyName}',
    description: 'References to the current company name.',
  },
];

/**
 * SMS message form content.
 */
function SMSMessageFormContent({
  // #withCurrentOrganization
  organization: { name },
}) {
  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <FormContent>
          <FormFields>
            <SMSMessageFormFields />

            <SMSMessageVariables>
              <MessageVariable>
                {intl.formatHTMLMessage(
                  { id: 'sms_message.dialog.message_variable_description' },
                  {
                    value: name,
                  },
                )}
              </MessageVariable>
              {/* {messageVariables.map(({ variable, description }) => (
                <MessageVariable>
                  <strong>{variable}</strong> {description} 
                </MessageVariable>
              ))} */}
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

export default compose(withCurrentOrganization())(SMSMessageFormContent);

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
