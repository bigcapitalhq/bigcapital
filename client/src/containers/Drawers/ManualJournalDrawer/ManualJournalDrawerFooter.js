import React from 'react';
import { FormattedMessage as T } from 'react-intl';

export default function ManualJournalDrawerFooter({
  manualJournal: { amount_formatted },
}) {
  return (
    <div className="journal-drawer__content--footer">
      <div className="wrapper">
        <div>
          <span>
            <T id={'sub_total'} />
          </span>
          <p>{amount_formatted}</p>
        </div>
        <div>
          <span>
            <T id={'total'} />
          </span>
          <p>{amount_formatted}</p>
        </div>
      </div>
    </div>
  );
}
