import React, {useMemo} from 'react';
import {
  Intent,
  Button,
} from '@blueprintjs/core';
import { FormattedList } from 'react-intl';

export default function MakeJournalEntriesFooter({
  formik,
}) {

  return (
    <div>
      <div class="form__floating-footer">
        <Button
          intent={Intent.PRIMARY}
          type="submit">
          Save
        </Button>

        <Button
          intent={Intent.PRIMARY}
          type="submit"
          className={'ml1'}>
          Save & New
        </Button>

        <Button
          type="submit"
          className={'button-secondary ml1'}>
          Save as Draft
        </Button>

        <Button
          type="submit"
          className={'button-secondary ml1'}>
          Cancel
        </Button>
      </div>
    </div>
  );
}