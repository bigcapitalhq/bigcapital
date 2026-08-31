import { Intent } from '@blueprintjs/core';
import { castArray } from 'lodash';

interface ResponseError {
  type: string;
  payload?: { unsupported_args?: string | string[]; [key: string]: unknown };
}

interface TransformErrorsArgs {
  // Loose signature to accept Formik's `FormikErrors<XxxFormValues>` shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setErrors: (errors: any) => void;
}

export const transformErrors = (
  errors: ResponseError[],
  { setErrors }: TransformErrorsArgs,
) => {
  const unsupportedVariablesError = errors.find(
    (error) => error.type === 'UNSUPPORTED_SMS_MESSAGE_VARIABLES',
  );
  if (unsupportedVariablesError) {
    const variables = castArray(
      unsupportedVariablesError.payload?.unsupported_args ?? [],
    );
    const stringifiedVariables = variables.join(', ');

    setErrors({
      messageText: `The SMS message has unsupported variables - ${stringifiedVariables}`,
      intent: Intent.DANGER,
    });
  }
};
