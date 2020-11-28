import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T } from 'react-intl';
import { saveInvoke } from 'utils';
import { CLASSES } from 'common/classes';

export default function MakeJournalFloatingAction({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  manualJournalId,
}) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        name={'save'}
        onClick={() => {
          saveInvoke(onSubmitClick, { publish: true, redirect: true });
        }}
      >
        {manualJournalId ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save_and_new'}
        onClick={() => {
          saveInvoke(onSubmitClick, { publish: true, redirect: false });
        }}
      >
        <T id={'save_new'} />
      </Button>

      <Button
        disabled={isSubmitting}
        className={'button-secondary ml1'}
        onClick={() => {
          saveInvoke(onSubmitClick, { publish: false, redirect: true });
        }}
      >
        <T id={'save_as_draft'} />
      </Button>

      <Button
        className={'button-secondary ml1'}
        onClick={() => {
          saveInvoke(onCancelClick);
        }}
      >
        <T id={'cancel'} />
      </Button>
    </div>
  );
}
