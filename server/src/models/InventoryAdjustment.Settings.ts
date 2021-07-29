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
      columnable: true,
    },
    'type': {
      name: 'Adjustment type',
      column: 'type',
      fieldType: 'enumeration',
      options: [
        { key: 'increment', name: 'Increment' },
        { key: 'decrement', name: 'Decrement' },
      ],
      columnable: true,
    },
    'adjustment_account': {
      name: 'Adjustment account',
      column: 'adjustment_account_id',
      columnable: true,
    },
    'reason': {
      name: 'Reason',
      column: 'reason',
      fieldType: 'text',
      columnable: true,
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
      columnable: true,
    },
    'description': {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
      columnable: true,
    },
    'published_at': {
      name: 'Published at',
      column: 'published_at',
      fieldType: 'date',
      columnable: true,
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
      columnable: true,
    },
  },
};
