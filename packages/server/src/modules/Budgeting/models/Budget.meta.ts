export const BudgetMeta = {
  defaultFilterField: 'start_date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },

  fields: {
    name: {
      name: 'budget.field.name',
      column: 'name',
      fieldType: 'text',
    },
    start_date: {
      name: 'budget.field.start_date',
      column: 'start_date',
      fieldType: 'date',
    },
    end_date: {
      name: 'budget.field.end_date',
      column: 'end_date',
      fieldType: 'date',
    },
    budget_type: {
      name: 'budget.field.budget_type',
      column: 'budget_type',
      fieldType: 'enumeration',
      options: [
        { key: 'profit_and_loss', label: 'Profit & Loss' },
        { key: 'balance_sheet', label: 'Balance Sheet' },
      ],
    },
    period_type: {
      name: 'budget.field.period_type',
      column: 'period_type',
      fieldType: 'enumeration',
      options: [
        { key: 'monthly', label: 'Monthly' },
        { key: 'quarterly', label: 'Quarterly' },
        { key: 'annual', label: 'Annual' },
      ],
    },
    status: {
      name: 'budget.field.status',
      column: 'status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'Draft' },
        { key: 'active', label: 'Active' },
        { key: 'closed', label: 'Closed' },
      ],
      filterCustomQuery(query, role) {
        query.modify('filterByStatus', role.value);
      },
      sortCustomQuery(query, role) {
        query.orderBy('budgets.status', role.order);
      },
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
    startDate: {
      name: 'budget.field.start_date',
      type: 'date',
    },
    endDate: {
      name: 'budget.field.end_date',
      type: 'date',
    },
    budgetType: {
      name: 'budget.field.budget_type',
      type: 'text',
    },
    periodType: {
      name: 'budget.field.period_type',
      type: 'text',
    },
    status: {
      name: 'budget.field.status',
      type: 'text',
    },
    createdAt: {
      name: 'budget.field.created_at',
      type: 'date',
      printable: false,
    },
  },
};
