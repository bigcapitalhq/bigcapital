import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import intl from 'react-intl-universal';

export const transformErrors = (errors, { setErrors }) => {
  if (
    errors.find((error) => error.type === 'UNSUPPORTED_SMS_MESSAGE_VARIABLES')
  ) {
    setErrors({
      message_text: intl.get(
        'sms_message.dialog.unsupported_variables_error_message',
      ),
    });
  }
};
