import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { saveInvoke } from 'utils';

export default function BillFloatingActions({
  isSubmitting,
  onSubmitClick,
  onSubmitAndNewClick,
  onCancelClick,
  onClearClick,
  billId,
}) {
  return (
    <div className={'form__floating-footer'}>
      <Button
        disabled={isSubmitting}
        loading={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={(event) => {
          saveInvoke(onSubmitClick, event);
        }}
      >
        {billId ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button
        disabled={isSubmitting}
        loading={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
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
          saveInvoke(onClearClick, event);
        }}
      >
        <T id={'clear'} />
      </Button>

      <Button
        className={'ml1'}
        type="submit"
        onClick={(event) => {
          saveInvoke(onCancelClick, event);
        }}
      >
        <T id={'close'} />
      </Button>
    </div>
  );
}
