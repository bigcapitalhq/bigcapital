import React from 'react';

export default function ManualJournalDrawerFooter({
  manualJournal: { amount_formatted },
}) {
  return (
    <div className="journal-drawer__content--footer">
      <div className="wrapper">
        <div>
          <span>Sub Total</span>
          <p>{amount_formatted}</p>
        </div>
        <div>
          <span>Total</span>
          <p>{amount_formatted}</p>
        </div>
      </div>
    </div>
  );
}
