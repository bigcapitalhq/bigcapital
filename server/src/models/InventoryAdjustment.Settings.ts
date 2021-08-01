export default {
  defaultFilterField: 'date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'date',
  },
  fields: {
    'date': {
      name: 'Date',
      column: 'date',
      fieldType: 'date',
    },
    'type': {
      name: 'Adjustment type',
      column: 'type',
      fieldType: 'enumeration',
      options: [
        { key: 'increment', name: 'Increment' },
        { key: 'decrement', name: 'Decrement' },
      ],
    },
    'adjustment_account': {
      name: 'Adjustment account',
      column: 'adjustment_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'adjustmentAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    'reason': {
      name: 'Reason',
      column: 'reason',
      fieldType: 'text',
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
    },
    'description': {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    'published_at': {
      name: 'Published at',
      column: 'published_at',
      fieldType: 'date',
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};
