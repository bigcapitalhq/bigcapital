import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

export default function PaymentReceiveFormFooter({
  formik: { isSubmitting, resetForm },
  onSubmitClick,
  onCancelClick,
  onClearClick,
}) {
  return (
    <div className={'estimate-form__floating-footer'}>
      <Button disabled={isSubmitting} intent={Intent.PRIMARY} type="submit">
        <T id={'save_send'} />
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save'}
        type="submit"
      >
        <T id={'save'} />
      </Button>

      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={() => onClearClick && onClearClick()}
      >
        <T id={'clear'} />
      </Button>

      <Button
        className={'ml1'}
        type="submit"
        onClick={() => {
          onCancelClick && onCancelClick();
        }}
      >
        <T id={'close'} />
      </Button>
    </div>
  );
}
