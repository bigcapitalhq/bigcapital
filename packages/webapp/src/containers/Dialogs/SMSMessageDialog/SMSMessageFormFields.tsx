import { Intent, Button, FormGroup, TextArea } from '@blueprintjs/core';
import { useFormikContext, FastField, ErrorMessage } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useSMSMessageDialogContext } from './SMSMessageDialogProvider';
import type { SMSMessageFormValues } from './types';
import { FormattedMessage as T } from '@/components';
import { inputIntent } from '@/utils';

interface MessageTextFieldRenderProps {
  field: Record<string, unknown>;
  meta: { error?: string; touched?: boolean };
}

export function SMSMessageFormFields(): React.ReactElement {
  // SMS message dialog context.
  const { smsNotification } = useSMSMessageDialogContext();

  // Form formik context.
  const { setFieldValue } = useFormikContext<SMSMessageFormValues>();

  // Handle the button click.
  const handleBtnClick = () => {
    setFieldValue('messageText', smsNotification.defaultSmsMessage ?? '');
  };

  return (
    <div>
      {/* ----------- Message Text ----------- */}
      <FastField name={'messageText'}>
        {({ field, meta: { error, touched } }: MessageTextFieldRenderProps) => (
          <FormGroup
            label={intl.get('notify_via_sms.dialog.message_text')}
            className={'form-group--message_text'}
            intent={inputIntent({ error, touched }) as Intent | undefined}
            helperText={
              <>
                <ErrorMessage name={'messageText'} />
                <ResetButton
                  minimal={true}
                  small={true}
                  intent={Intent.PRIMARY}
                  onClick={handleBtnClick}
                >
                  <T id={'sms_message.edit_form.reset_to_default_message'} />
                </ResetButton>
              </>
            }
          >
            <TextArea
              growVertically={true}
              large={true}
              intent={inputIntent({ error, touched }) as Intent | undefined}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

const ResetButton = styled(Button)`
  font-size: 12px;
`;
