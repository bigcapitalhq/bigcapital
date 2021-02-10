import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import MakeJournalEntriesHeaderFields from "./MakeJournalEntriesHeaderFields";

export default function MakeJournalEntriesHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <MakeJournalEntriesHeaderFields />
    </div>
  )
}