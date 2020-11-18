import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { saveInvoke } from 'utils';


export default function VendorFloatingActions({
  onSubmitClick,
  onSubmitAndNewClick,
  onCancelClick,
  isSubmitting,
  vendor,
}) {
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
        {vendor ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save_and_new'}
        type="submit"
        onClick={(event) => {
          saveInvoke(onSubmitAndNewClick, event);
        }}
      >
        <T id={'save_new'} />
      </Button>
      <Button
        className={'ml1'}
        onClick={(event) => {
          saveInvoke(onCancelClick, event);
        }}
      >
        <T id={'close'} />
      </Button>
    </div>
  );
}
