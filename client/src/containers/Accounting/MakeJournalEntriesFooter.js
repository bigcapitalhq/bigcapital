import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

export default function MakeJournalEntriesFooter({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  manualJournalId,
}) {
  return (
    <div>
      <div class="form__floating-footer">
        <Button
          disabled={isSubmitting}
          intent={Intent.PRIMARY}
          name={'save'}
          onClick={() => {
            onSubmitClick({ publish: true, redirect: true });
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
            onSubmitClick({ publish: true, redirect: false });
          }}
        >
          <T id={'save_new'} />
        </Button>

        <Button
          disabled={isSubmitting}
          className={'button-secondary ml1'}
          onClick={() => {
            onSubmitClick({ publish: false, redirect: false });
          }}
        >
          <T id={'save_as_draft'} />
        </Button>

        <Button
          className={'button-secondary ml1'}
          onClick={() => {
            onCancelClick && onCancelClick();
          }}
        >
          <T id={'cancel'} />
        </Button>
      </div>
    </div>
  );
}
