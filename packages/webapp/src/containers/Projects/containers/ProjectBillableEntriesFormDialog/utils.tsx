// @ts-nocheck
import React from 'react';
import moment from 'moment';
import { Callout, Intent, Classes } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';
import { FormattedMessage as T } from '@/components';

/**
 * Empty status callout.
 * @returns {React.JSX}
 */
export function EmptyStatusCallout() {
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
