export const RECURRING_JOURNAL_DEFAULT_VIEW_COLUMNS = [];

export const RecurringJournalDefaultViews = [
  {
    name: 'Active',
    slug: 'active',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'active',
      },
    ],
    columns: RECURRING_JOURNAL_DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Paused',
    slug: 'paused',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'paused',
      },
    ],
    columns: RECURRING_JOURNAL_DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Completed',
    slug: 'completed',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'completed',
      },
    ],
    columns: RECURRING_JOURNAL_DEFAULT_VIEW_COLUMNS,
  },
];
