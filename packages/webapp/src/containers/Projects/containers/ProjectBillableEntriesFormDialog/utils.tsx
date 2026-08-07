// @ts-nocheck
import { Callout, Intent, Classes } from '@blueprintjs/core';
import moment from 'moment';
import React from 'react';
import { FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';

/**
 * Empty status callout.
 * @returns {React.JSX}
 */
export function EmptyStatuCallout() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T
            id={'project_billable_entries.alert.there_is_no_billable_entries'}
          />
        </p>
      </Callout>
    </div>
  );
}
