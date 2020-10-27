import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { queryCache } from 'react-query';

export default function EstimateFloatingActions({
  formik: { isSubmitting, resetForm },
  onSubmitClick,
  onCancelClick,
  onClearClick,
  estimate,
}) {
  return (
    <div className={'form__floating-footer'}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={() => {
          onSubmitClick({ redirect: true });
        }}
      >
        {estimate && estimate.id ? <T id={'edit'} /> : <T id={'save_send'} />}
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save'}
        type="submit"
        onClick={() => {
          onSubmitClick({ redirect: false });
        }}
      >
        <T id={'save'} />
      </Button>

      <Button
        className={'ml1'}
        disabled={isSubmitting}
        // onClick={() => {
        //   onClearClick && onClearClick();
        // }}
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
