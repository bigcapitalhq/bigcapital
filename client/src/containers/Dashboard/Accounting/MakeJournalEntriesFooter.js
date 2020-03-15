import React, {useMemo} from 'react';
import {
  Intent,
  Button,
} from '@blueprintjs/core';
import { FormattedList } from 'react-intl';

export default function MakeJournalEntriesFooter({
  formik,
}) {
  const creditSum = useMemo(() => {
    return formik.values.entries.reduce((sum, entry) => {
      return entry.credit + sum;
    }, 0);
  }, [formik.values.entries]);

  const debitSum = useMemo(() => {
    return formik.values.entries.reduce((sum, entry) => {
      return entry.debit + sum;
    }, 0);
  }, [formik.values.entries]);

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td><strong>Total</strong></td>
            <td>{ creditSum }</td>
            <td>{ debitSum }</td>
          </tr>
        </tbody>
      </table>

      <div class="form__floating-footer">
        <Button
          intent={Intent.PRIMARY}
          type="submit">
          Save
        </Button>

        <Button
          intent={Intent.PRIMARY}
          type="submit"
          className={'ml2'}>
          Save & New
        </Button>
      </div>
    </div>
  );
}