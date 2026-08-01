import { Intent } from '@blueprintjs/core';
import { AppToaster } from '@/components';

interface ResponseError {
  type: string;
}

interface TransformErrorsArgs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setErrors: any;
}

/**
 * Transformes the response errors types.
 */
export const transformErrors = (
  errors: ResponseError[],
  { setErrors }: TransformErrorsArgs,
) => {
  if (errors.some(({ type }) => type === 'SALE_INVOICE_ALREADY_WRITTEN_OFF')) {
    AppToaster.show({
      message: 'SALE_INVOICE_ALREADY_WRITTEN_OFF',
      // message: intl.get(''),
      intent: Intent.DANGER,
    });
  }
  // FIXME: `setErrors` is never invoked — original code passes it in but does
  // not use it. Kept for behavioral parity.
  void setErrors;
};
