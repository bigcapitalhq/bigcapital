export default {
  defaultFilterField: 'date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  importable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'journalNumber',
  fields: {
    date: {
      name: 'manual_journal.field.date',
      column: 'date',
      fieldType: 'date',
    },
    journal_number: {
      name: 'manual_journal.field.journal_number',
      column: 'journal_number',
      fieldType: 'text',
    },
    reference: {
      name: 'manual_journal.field.reference',
      column: 'reference',
      fieldType: 'text',
    },
    journal_type: {
      name: 'manual_journal.field.journal_type',
      column: 'journal_type',
      fieldType: 'text',
    },
    amount: {
      name: 'manual_journal.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    description: {
      name: 'manual_journal.field.description',
      column: 'description',
      fieldType: 'text',
    },
    status: {
      name: 'manual_journal.field.status',
      column: 'status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'Draft' },
        { key: 'published', label: 'published' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    created_at: {
      name: 'manual_journal.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
  fields2: {
    date: {
      name: 'manual_journal.field.date',
      fieldType: 'date',
      required: true,
    },
    journalNumber: {
      name: 'manual_journal.field.journal_number',
      fieldType: 'text',
      required: true,
    },
    reference: {
      name: 'manual_journal.field.reference',
      fieldType: 'text',
    },
    journalType: {
      name: 'manual_journal.field.journal_type',
      fieldType: 'text',
    },
    currencyCode: {
      name: 'manual_journal.field.currency',
      fieldType: 'text',
    },
    exchange_rate: {
      name: 'manual_journal.field.exchange_rate',
      fieldType: 'number',
    },
    description: {
      name: 'manual_journal.field.description',
      fieldType: 'text',
    },
    entries: {
      name: 'Entries',
      fieldType: 'collection',
      collectionOf: 'object',
      collectionMinLength: 2,
      required: true,
      fields: {
        credit: {
          name: 'Credit',
          fieldType: 'number',
          required: true,
        },
        debit: {
          name: 'Debit',
          fieldType: 'number',
          required: true,
        },
        accountId: {
          name: 'Account',
          fieldType: 'relation',
          relationModel: 'Account',
          relationImportMatch: ['name', 'code'],
          required: true,
        },
        contact: {
          name: 'Contact',
          fieldType: 'relation',
          relationModel: 'Contact',
          relationImportMatch: 'displayName',
        },
        note: {
          name: 'Note',
          fieldType: 'text',
        },
      },
    },
    publish: {
      name: 'Publish',
      fieldType: 'boolean',
    },
  },
};

/**
 * Status field sorting custom query.
 */
function StatusFieldSortQuery(query, role) {
  return query.modify('sortByStatus', role.order);
}

/**
 * Status field filter custom query.
 */
function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}
