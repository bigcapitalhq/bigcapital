import { Classes, Dialog, HTMLTable, Spinner } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringJournalJournals } from '@/ee/recurring-journals/hooks/query';

export function RecurringJournalGeneratedJournalsDialog({
  recurringJournalId,
  isOpen,
  onClose,
}: {
  recurringJournalId?: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data, isLoading } = useRecurringJournalJournals(
    isOpen ? recurringJournalId : undefined,
    { pageSize: 100 },
    { enabled: isOpen && !!recurringJournalId },
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={intl.get('recurring_journal.generated_journals')}
      icon={'document'}
      style={{ width: 760 }}
    >
      <div className={Classes.DIALOG_BODY}>
        {isLoading ? (
          <Spinner />
        ) : (
          <HTMLTable striped interactive style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>{intl.get('journal_number_')}</th>
                <th>{intl.get('date')}</th>
                <th>{intl.get('status')}</th>
                <th style={{ textAlign: 'right' }}>{intl.get('amount')}</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((journal: any) => (
                <tr key={journal.id}>
                  <td>{journal.journalNumber}</td>
                  <td>{journal.formattedDate}</td>
                  <td>
                    {journal.isPublished
                      ? intl.get('published')
                      : intl.get('draft')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {journal.formattedAmount}
                  </td>
                </tr>
              ))}
              {!isLoading && (data?.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>
                    {intl.get('recurring_journal.no_generated_journals')}
                  </td>
                </tr>
              )}
            </tbody>
          </HTMLTable>
        )}
      </div>
    </Dialog>
  );
}
