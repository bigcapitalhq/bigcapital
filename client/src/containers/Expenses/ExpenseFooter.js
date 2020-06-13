import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

function ExpenseFooter({
  formik: { isSubmitting },
  onSubmitClick,
  onCancelClick,
}) {
  return (
    <div className={'form__floating-footer'}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save'}
        onClick={() => {
          onSubmitClick({ publish: true, redirect: true });
        }}
      >
        <T id={'save'} />
      </Button>

      <Button
        disabled={isSubmitting}
        className={'button-secondary ml1'}
        onClick={() => {
          onSubmitClick({ publish: true, redirect: false });
        }}
      >
        <T id={'save_as_draft'} />
      </Button>
      <Button
        className={'button-secondary ml1'}
        onClick={() => {
          onCancelClick && onCancelClick({ publish: false, redirect: false });
        }}
      >
        <T id={'cancel'} />
      </Button>
    </div>
  );
}

export default ExpenseFooter;
