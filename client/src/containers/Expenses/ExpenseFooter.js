import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

export default function ExpenseFloatingFooter({
  formik: { isSubmitting },
  onSubmitClick,
  onCancelClick,

  expense,
}) {
  return (
    <div className={'form__floating-footer'}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={() => {
          onSubmitClick({ publish: true, redirect: true });
        }}
      >
        {expense && expense.id ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save_and_new'}
        onClick={() => {
          onSubmitClick({ publish: true, redirect: false });
        }}
      >
        <T id={'save_new'} />
      </Button>

      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={() => {
          onSubmitClick({ publish: false, redirect: false });
        }}
      >
        <T id={'save_as_draft'} />
      </Button>

      <Button
        className={'ml1'}
        onClick={() => {
          onCancelClick && onCancelClick();
        }}
      >
        <T id={'close'} />
      </Button>
    </div>
  );
}
