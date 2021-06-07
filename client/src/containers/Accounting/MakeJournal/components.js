import React from 'react';
import { Intent, Position, Button, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { Icon, Money, Hint } from 'components';
import { formatMessage } from 'services/intl';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
  ContactsListFieldCell,
} from 'components/DataTableCells';
import { safeSumBy } from 'utils';

/**
 * Contact header cell.
 */
export function ContactHeaderCell() {
  return (
    <>
      <T id={'contact'} />
      <Hint
        content={<T id={'contact_column_hint'} />}
        position={Position.LEFT_BOTTOM}
      />
    </>
  );
}

/**
 * Credit header cell.
 */
export function CreditHeaderCell({ payload: { currencyCode } }) {
  return formatMessage({ id: 'credit_currency' }, { currency: currencyCode });
}

/**
 * debit header cell.
 */
export function DebitHeaderCell({ payload: { currencyCode } }) {
  return formatMessage({ id: 'debit_currency' }, { currency: currencyCode });
}

/**
 * Account footer cell.
 */
function AccountFooterCell({ payload: { currencyCode } }) {
  return (
    <span>
      {formatMessage({ id: 'total_currency' }, { currency: currencyCode })}
    </span>
  );
}

/**
 * Total credit table footer cell.
 */
function TotalCreditFooterCell({ payload: { currencyCode }, rows }) {
  const credit = safeSumBy(rows, 'original.credit');

  return (
    <span>
      <Money amount={credit} currency={currencyCode} />
    </span>
  );
}

/**
 * Total debit table footer cell.
 */
function TotalDebitFooterCell({ payload: { currencyCode }, rows }) {
  const debit = safeSumBy(rows, 'original.debit');

  return (
    <span>
      <Money amount={debit} currency={currencyCode} />
    </span>
  );
}
/**
 * Actions cell renderer.
 */
export const ActionsCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  data,
  payload,
}) => {
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

/**
 * Retrieve columns of make journal entries table.
 */
export const useJournalTableEntriesColumns = () => {
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
        sticky: 'left',
      },
      {
        Header: formatMessage({ id: 'account' }),
        id: 'account_id',
        accessor: 'account_id',
        Cell: AccountsListFieldCell,
        Footer: AccountFooterCell,
        className: 'account',
        disableSortBy: true,
        width: 160,
      },
      {
        Header: CreditHeaderCell,
        accessor: 'credit',
        Cell: MoneyFieldCell,
        Footer: TotalCreditFooterCell,
        className: 'credit',
        disableSortBy: true,
        width: 100,
      },
      {
        Header: DebitHeaderCell,
        accessor: 'debit',
        Cell: MoneyFieldCell,
        Footer: TotalDebitFooterCell,
        className: 'debit',
        disableSortBy: true,
        width: 100,
      },
      {
        Header: ContactHeaderCell,
        id: 'contact_id',
        accessor: 'contact_id',
        Cell: ContactsListFieldCell,
        className: 'contact',
        disableSortBy: true,
        width: 120,
      },
      {
        Header: formatMessage({ id: 'note' }),
        accessor: 'note',
        Cell: InputGroupCell,
        disableSortBy: true,
        className: 'note',
        width: 200,
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
  );
};
