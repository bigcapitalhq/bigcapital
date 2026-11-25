import { Intent, Menu, MenuDivider, MenuItem, Tag } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import type { RecurringJournalsListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Can, Icon } from '@/components';
import { MoneyDisplay } from '@/components/Money/MoneyDisplay';
import {
  AbilitySubject,
  RecurringJournalAction,
} from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export type RecurringJournalTableRow = NonNullable<
  RecurringJournalsListResponse['data']
>[number];

interface RecurringJournalActionsPayload {
  onEdit: (recurringJournal: RecurringJournalTableRow) => void;
  onDelete: (recurringJournal: RecurringJournalTableRow) => void;
  onPause: (recurringJournal: RecurringJournalTableRow) => void;
  onResume: (recurringJournal: RecurringJournalTableRow) => void;
  onGenerate: (recurringJournal: RecurringJournalTableRow) => void;
  onViewJournals: (recurringJournal: RecurringJournalTableRow) => void;
  onViewDetails: (recurringJournal: RecurringJournalTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: RecurringJournalTableRow };
  payload: RecurringJournalActionsPayload;
}

export function RecurringJournalStatus({
  status,
  failureCount,
}: {
  status: string;
  failureCount?: number;
}) {
  if (failureCount && failureCount > 0) {
    return (
      <Tag intent={Intent.WARNING} round minimal>
        {intl.get('recurring_journal.status.needs_attention')}
      </Tag>
    );
  }
  const intents = {
    active: Intent.SUCCESS,
    paused: Intent.WARNING,
    completed: Intent.NONE,
  } as Record<string, Intent>;

  return (
    <Tag intent={intents[status] ?? Intent.NONE} round minimal>
      {intl.get(`recurring_journal.status.${status}`)}
    </Tag>
  );
}

export function ActionsMenu({
  row: { original },
  payload: {
    onEdit,
    onDelete,
    onPause,
    onResume,
    onGenerate,
    onViewJournals,
    onViewDetails,
  },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <MenuItem
        icon={<Icon icon="document" />}
        text={intl.get('recurring_journal.view_generated_journals')}
        onClick={safeCallback(onViewJournals, original)}
      />
      <Can I={RecurringJournalAction.Edit} a={AbilitySubject.RecurringJournal}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_recurring_journal')}
          onClick={safeCallback(onEdit, original)}
        />
        <MenuItem
          icon={<Icon icon="refresh" />}
          text={intl.get('recurring_journal.generate_now')}
          onClick={safeCallback(onGenerate, original)}
        />
        {original.status === 'paused' ? (
          <MenuItem
            icon={<Icon icon="play" />}
            text={intl.get('recurring_journal.resume')}
            onClick={safeCallback(onResume, original)}
          />
        ) : (
          original.status === 'active' && (
            <MenuItem
              icon={<Icon icon="pause" />}
              text={intl.get('recurring_journal.pause')}
              onClick={safeCallback(onPause, original)}
            />
          )
        )}
      </Can>
      <Can
        I={RecurringJournalAction.Delete}
        a={AbilitySubject.RecurringJournal}
      >
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_recurring_journal')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

const column = createColumnHelper<BP_TableFeatures, RecurringJournalTableRow>();

export function useRecurringJournalsTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('profileName', {
          id: 'profile_name',
          header: intl.get('recurring_journal.field.profile_name'),
          size: 250,
        }),
        column.accessor('amountFormatted', {
          id: 'amount',
          header: intl.get('recurring_journal.field.amount'),
          size: 200,
          meta: { textAlign: 'right' },
          cell: ({ getValue }) => <MoneyDisplay>{getValue()}</MoneyDisplay>,
        }),
        column.accessor(
          (row) =>
            intl.get('recurring_journal.frequency_summary', {
              interval: row.repeatInterval,
              frequency: intl.get(
                `recurring_journal.frequency.${row.frequency}`,
              ),
            }),
          {
            id: 'frequency',
            header: intl.get('recurring_journal.field.frequency'),
            size: 200,
          },
        ),
        column.accessor(
          (row) => row.nextJournalDateFormatted || row.nextJournalDate,
          {
            id: 'next_journal_date',
            header: intl.get('recurring_journal.field.next_journal_date'),
            size: 200,
          },
        ),
        column.accessor(
          (row) => row.lastJournalDateFormatted || row.lastJournalDate,
          {
            id: 'last_journal_date',
            header: intl.get('recurring_journal.field.last_journal_date'),
            size: 200,
          },
        ),
        column.accessor('status', {
          id: 'status',
          header: intl.get('recurring_journal.field.status'),
          size: 120,
          cell: ({ getValue, row }) => (
            <RecurringJournalStatus
              status={getValue()}
              failureCount={row.original.failureCount}
            />
          ),
        }),
      ]),
    [],
  );
}
