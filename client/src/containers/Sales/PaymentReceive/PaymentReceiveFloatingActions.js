import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';

/**
 * Payment receive floating actions bar.
 */
export default function PaymentReceiveFormFloatingActions({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  onClearClick,
  paymentReceiveId,
}) {
  const handleSubmitClick = (event) => {
    onSubmitClick && onSubmitClick(event);
  };

  const handleClearBtnClick = (event) => {
    onClearClick && onClearClick(event);
  };

  const handleCloseBtnClick = (event) => {
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
        {paymentReceiveId ? <T id={'edit'} /> : <T id={'save_send'} />}
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

      <Button className={'ml1'} type="submit" onClick={handleCloseBtnClick}>
        <T id={'close'} />
      </Button>
    </div>
  );
}
