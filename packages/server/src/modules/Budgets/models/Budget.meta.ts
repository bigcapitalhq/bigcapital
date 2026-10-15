export const BudgetMeta = {
  defaultFilterField: 'name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },

  print: {
    pageTitle: 'Budgets',
  },

  fields: {
    name: {
      name: 'budget.field.name',
      column: 'name',
      fieldType: 'text',
    },
    from_date: {
      name: 'budget.field.from_date',
      column: 'from_date',
      fieldType: 'date',
    },
    to_date: {
      name: 'budget.field.to_date',
      column: 'to_date',
      fieldType: 'date',
    },
    created_at: {
      name: 'budget.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },

  columns: {
    name: {
      name: 'budget.field.name',
      type: 'text',
    },
    fromDate: {
      name: 'budget.field.from_date',
      type: 'date',
      accessor: 'formattedFromDate',
    },
    toDate: {
      name: 'budget.field.to_date',
      type: 'date',
      accessor: 'formattedToDate',
    },
    description: {
      name: 'budget.field.description',
      type: 'text',
    },
    createdAt: {
      name: 'budget.field.created_at',
      accessor: 'formattedCreatedAt',
      printable: false,
    },
  },
};
