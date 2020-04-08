import React, {useMemo} from 'react';
import {
  Intent,
  Button,
} from '@blueprintjs/core';
import { FormattedList } from 'react-intl';

export default function MakeJournalEntriesFooter({
  formik,
  onSubmitClick,
  onCancelClick,
}) {
  return (
    <div>
      <div class="form__floating-footer">
        <Button
          disabled={formik.isSubmitting}
          intent={Intent.PRIMARY}
          name={'save'}
          onClick={() => {
            onSubmitClick({ publish: true, redirect: true });
          }}>
          Save
        </Button>

        <Button
          disabled={formik.isSubmitting}
          intent={Intent.PRIMARY}
          className={'ml1'}
          name={'save_and_new'}
          onClick={() => {
            onSubmitClick({ publish: true, redirect: false }); 
          }}>
          Save & New
        </Button>

        <Button
          disabled={formik.isSubmitting}
          className={'button-secondary ml1'}
          onClick={() => {
            onSubmitClick({ publish: false, redirect: false }); 
          }}>
          Save as Draft
        </Button>

        <Button
          className={'button-secondary ml1'}
          onClick={() => {
            onCancelClick && onCancelClick();
          }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}