import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { saveInvoke } from 'utils';

/**
 * Expense form floating actions.
 */
export default function ExpenseFloatingFooter({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  onDraftClick,
  onSubmitAndNewClick,
  expense,
}) {
  const handleSubmitBtnClick = (event) => {
    saveInvoke(onSubmitClick, event);
  };

  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancelClick, event);
  };

  const handleSubmitAndDraftBtnClick = (event) => {
    saveInvoke(onDraftClick, event);
  };

  const handleSubmitAndNewBtnClick = (event) => {
    saveInvoke(onSubmitAndNewClick, event);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={handleSubmitBtnClick}
      >
        {expense && expense.id ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleSubmitAndNewBtnClick}
        type="submit"
      >
        <T id={'save_new'} />
      </Button>

      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleSubmitAndDraftBtnClick}
      >
        <T id={'save_as_draft'} />
      </Button>

      <Button className={'ml1'} onClick={handleCancelBtnClick}>
        <T id={'close'} />
      </Button>
    </div>
  );
}
