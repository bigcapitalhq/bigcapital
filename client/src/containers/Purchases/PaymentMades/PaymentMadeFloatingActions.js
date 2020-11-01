import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';

/**
 * Payment made floating actions bar.
 */
export default function PaymentMadeFloatingActions({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  onClearBtnClick,
}) {
  const handleClearBtnClick = (event) => {
    onClearBtnClick && onClearBtnClick(event);
  };

  const handleSubmitClick = (event) => {
    onSubmitClick && onSubmitClick(event, { redirect: true });
  };

  const handleCancelClick = (event) => {
    onCancelClick && onCancelClick(event);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={handleSubmitClick}
      >
        <T id={'save_send'} />
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save'}
        type="submit"
        onClick={handleSubmitClick}
      >
        <T id={'save'} />
      </Button>

      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
      >
        <T id={'clear'} />
      </Button>

      <Button
        className={'ml1'}
        type="submit"
        onClick={handleCancelClick}
      >
        <T id={'close'} />
      </Button>
    </div>
  );
}
