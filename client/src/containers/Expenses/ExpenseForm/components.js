


const ExpenseCategoryHeaderCell = () => {
  return (
    <>
      <T id={'expense_category'} />
      <Hint />
    </>
  );
};

// Actions cell renderer.
const ActionsCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  data,
  payload,
}) => {
  if (data.length <= index + 1) {
    return '';
  }
  const onClickRemoveRole = () => {
    payload.removeRow(index);
  };
  return (
    <Tooltip content={<T id={'remove_the_line'} />} position={Position.LEFT}>
      <Button
        icon={<Icon icon="times-circle" iconSize={14} />}
        iconSize={14}
        className="ml2"
        minimal={true}
        intent={Intent.DANGER}
        onClick={onClickRemoveRole}
      />
    </Tooltip>
  );
};

// Total text cell renderer.
const TotalExpenseCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length <= props.row.index + 1) {
    return (
      <span>
        <T id={'total_currency'} values={{ currency: 'USD' }} />
      </span>
    );
  }
  return chainedComponent(props);
};

/**
 * Note cell renderer.
 */
const NoteCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return '';
  }
  return chainedComponent(props);
};

/**
 * Total amount cell renderer.
 */
const TotalAmountCellRenderer = (chainedComponent, type) => (props) => {
    if (props.data.length === props.row.index + 1) {
      const total = props.data.reduce((total, entry) => {
        const amount = parseInt(entry[type], 10);
        const computed = amount ? total + amount : total;
  
        return computed;
      }, 0);
  
      return <span>{formattedAmount(total, 'USD')}</span>;
    }
    return chainedComponent(props);
  };
  


  export function useExpenseFormTableColumns() {
    return React.useMemo(
        () => [
          {
            Header: '#',
            accessor: 'index',
            Cell: ({ row: { index } }) => <span>{index + 1}</span>,
            className: 'index',
            width: 40,
            disableResizing: true,
            disableSortBy: true,
          },
          {
            Header: ExpenseCategoryHeaderCell,
            id: 'expense_account_id',
            accessor: 'expense_account_id',
            Cell: TotalExpenseCellRenderer(AccountsListFieldCell),
            className: 'expense_account_id',
            disableSortBy: true,
            width: 40,
            filterAccountsByRootType: ['expense'],
          },
          {
            Header: formatMessage({ id: 'amount_currency' }, { currency: 'USD' }),
            accessor: 'amount',
            Cell: TotalAmountCellRenderer(MoneyFieldCell, 'amount'),
            disableSortBy: true,
            width: 40,
            className: 'amount',
          },
          {
            Header: formatMessage({ id: 'description' }),
            accessor: 'description',
            Cell: NoteCellRenderer(InputGroupCell),
            disableSortBy: true,
            className: 'description',
            width: 100,
          },
          {
            Header: '',
            accessor: 'action',
            Cell: ActionsCellRenderer,
            className: 'actions',
            disableSortBy: true,
            disableResizing: true,
            width: 45,
          },
        ],
        [formatMessage],
      )
  }