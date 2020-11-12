import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { saveInvoke } from 'utils';

export default function ReceiptFormFloatingActions({
  isSubmitting,
  receiptId,
  onSubmitClick,
  onCancelClick,
  onClearClick,
  onSubmitAndNewClick,
}) {
  const { resetForm } = useFormikContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={(event) => {
          saveInvoke(onSubmitClick, event);
        }}
      >
        {receiptId ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save'}
        type="submit"
        onClick={(event) => {
          saveInvoke(onSubmitAndNewClick, event);
        }}
      >
        <T id={'save_new'} />
      </Button>

      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={(event) => {
          resetForm();
          saveInvoke(onClearClick, event);
        }}
      >
        <T id={'clear'} />
      </Button>

      <Button className={'ml1'} onClick={(event) => {
        saveInvoke(onCancelClick, event);
      }}>
        <T id={'close'} />
      </Button>
    </div>
  );
}
