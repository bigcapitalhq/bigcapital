import React from 'react';
import { FormattedMessage as T } from 'react-intl';

/**
 *  Manual journal details header.
 */
export default function ManualJournalDrawerHeader({
  manualJournal: {
    amount_formatted,
    journal_type,
    journal_number,
    reference,
    currency_code,
  },
}) {
  return (
    <div className={'journal-drawer__content--header'}>
      <div>
        <T id={'total'} />
        <p className="balance">{amount_formatted}</p>
      </div>
      <div>
        <span>
          <T id={'journal_type'} />
        </span>
        <p>{journal_type}</p>
      </div>
      <div>
        <span>
          <T id={'journal_no'} />
        </span>
        <p>{journal_number}</p>
      </div>
      <div>
        <span>
          <T id={'reference_no'} />
        </span>
        <p>{reference}</p>
      </div>
      <div>
        <span>
          <T id={'currency'} />
        </span>
        <p>{currency_code}</p>
      </div>
    </div>
  );
}
