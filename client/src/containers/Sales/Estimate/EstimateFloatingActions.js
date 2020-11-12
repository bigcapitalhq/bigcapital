import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { saveInvoke } from 'utils';

export default function EstimateFloatingActions({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  onClearClick,
  onSubmitAndNewClick,
  estimateId,
}) {
  const handleSubmitBtnClick = (event) => {
    saveInvoke(onSubmitClick, event);
  };

  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancelClick, event);
  };

  const handleClearBtnClick = (event) => {
    saveInvoke(onClearClick, event);
  };

  const handleSubmitAndNewClick = (event) => {
    saveInvoke(onSubmitAndNewClick, event);
  }

  return (
    <div className={'form__floating-footer'}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={handleSubmitBtnClick}
      >
        {(estimateId) ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        type="submit"
        onClick={handleSubmitAndNewClick}
      >
        <T id={'save_new'} />
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
        onClick={handleCancelBtnClick}
      >
        <T id={'close'} />
      </Button>
    </div>
  );
}
