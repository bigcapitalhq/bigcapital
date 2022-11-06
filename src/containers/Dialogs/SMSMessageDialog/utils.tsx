// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import { castArray } from 'lodash';

export const transformErrors = (errors, { setErrors }) => {
  let unsupportedVariablesError = errors.find(
    (error) => error.type === 'UNSUPPORTED_SMS_MESSAGE_VARIABLES',
  );
  if (unsupportedVariablesError) {
    const variables = castArray(
      unsupportedVariablesError.data.unsupported_args,
    );
    const stringifiedVariables = variables.join(', ');

    setErrors({
      message_text: `The SMS message has unsupported variables - ${stringifiedVariables}`,
      intent: Intent.DANGER,
    });
  }
};
