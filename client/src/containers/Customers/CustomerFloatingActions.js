import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

export default function CustomerFloatingActions({
  isSubmitting,
  resetForm,
  onSubmitClick,
  onCancelClick,

  customerId,
}) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={() => {
          onSubmitClick({ publish: true, redirect: true });
        }}
      >
        {customerId ? <T id={'edit'} /> : <T id={'save'} />}
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
        onClick={() => {
          onCancelClick && onCancelClick();
        }}
      >
        <T id={'close'} />
      </Button>
    </div>
  );
}
