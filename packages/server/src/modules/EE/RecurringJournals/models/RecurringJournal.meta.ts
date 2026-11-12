function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}

export const RecurringJournalMeta = {
  defaultFilterField: 'profile_name',
  defaultSort: {
    sortOrder: 'ASC',
    sortField: 'next_journal_date',
  },
  exportable: false,
  importable: false,

  fields: {
    profile_name: {
      name: 'recurring_journal.field.profile_name',
      column: 'profile_name',
      fieldType: 'text',
    },
    reference: {
      name: 'recurring_journal.field.reference',
      column: 'reference',
      fieldType: 'text',
    },
    frequency: {
      name: 'recurring_journal.field.frequency',
      column: 'frequency',
      fieldType: 'enumeration',
      options: [
        { key: 'day', label: 'recurring_journal.field.frequency.day' },
        { key: 'week', label: 'recurring_journal.field.frequency.week' },
        { key: 'month', label: 'recurring_journal.field.frequency.month' },
        { key: 'year', label: 'recurring_journal.field.frequency.year' },
      ],
    },
    repeat_interval: {
      name: 'recurring_journal.field.repeat_interval',
      column: 'repeat_interval',
      fieldType: 'number',
    },
    start_date: {
      name: 'recurring_journal.field.start_date',
      column: 'start_date',
      fieldType: 'date',
    },
    end_date: {
      name: 'recurring_journal.field.end_date',
      column: 'end_date',
      fieldType: 'date',
    },
    next_journal_date: {
      name: 'recurring_journal.field.next_journal_date',
      column: 'next_journal_date',
      fieldType: 'date',
    },
    last_journal_date: {
      name: 'recurring_journal.field.last_journal_date',
      column: 'last_journal_date',
      fieldType: 'date',
    },
    status: {
      name: 'recurring_journal.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'active', label: 'recurring_journal.field.status.active' },
        { key: 'paused', label: 'recurring_journal.field.status.paused' },
        {
          key: 'completed',
          label: 'recurring_journal.field.status.completed',
        },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    created_at: {
      name: 'recurring_journal.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};
