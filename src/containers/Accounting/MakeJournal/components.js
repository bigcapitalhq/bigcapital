import React from 'react';
import { Menu, MenuItem, Position, Button } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import {
  ExchangeRateInputGroup,
  Icon,
  Hint,
  FormattedMessage as T,
  FSelect,
} from 'components';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
  ContactsListFieldCell,
  BranchesListFieldCell,
} from 'components/DataTableCells';

import { CellType, Features, Align } from 'common';

import { useFeatureCan } from 'hooks/state';
import { useCurrentOrganization } from 'hooks/state';
import { useJournalIsForeign } from './utils';

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
  return intl.get('credit_currency', { currency: currencyCode });
}

/**
 * debit header cell.
 */
export function DebitHeaderCell({ payload: { currencyCode } }) {
  return intl.get('debit_currency', { currency: currencyCode });
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
  const handleClickRemoveRole = () => {
    payload.removeRow(index);
  };
  const exampleMenu = (
    <Menu>
      <MenuItem
        onClick={handleClickRemoveRole}
        text={intl.get('make_journal.entries.remove_row')}
      />
    </Menu>
  );
  return (
    <Popover2 content={exampleMenu} placement="left-start">
      <Button
        icon={<Icon icon={'more-13'} iconSize={13} />}
        iconSize={14}
        className="m12"
        minimal={true}
      />
    </Popover2>
  );
};
ActionsCellRenderer.cellType = CellType.Button;

/**
 * Retrieve columns of make journal entries table.
 */
export const useJournalTableEntriesColumns = () => {
  const { featureCan } = useFeatureCan();

  return React.useMemo(
    () => [
      {
        Header: intl.get('account'),
        id: 'account_id',
        accessor: 'account_id',
        Cell: AccountsListFieldCell,
        disableSortBy: true,
        width: 160,
        fieldProps: { allowCreate: true },
      },
      {
        Header: CreditHeaderCell,
        accessor: 'credit',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 100,
        align: Align.Right,
      },
      {
        Header: DebitHeaderCell,
        accessor: 'debit',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 100,
        align: Align.Right,
      },
      {
        Header: ContactHeaderCell,
        id: 'contact_id',
        accessor: 'contact_id',
        Cell: ContactsListFieldCell,
        disableSortBy: true,
        width: 120,
      },
      ...(featureCan(Features.Branches)
        ? [
            {
              Header: intl.get('branch'),
              id: 'branch_id',
              accessor: 'branch_id',
              Cell: BranchesListFieldCell,
              disableSortBy: true,
              width: 120,
            },
          ]
        : []),
      {
        Header: intl.get('note'),
        accessor: 'note',
        Cell: InputGroupCell,
        disableSortBy: true,
        width: 200,
      },
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        disableSortBy: true,
        disableResizing: true,
        width: 45,
        align: Align.Center,
      },
    ],
    [],
  );
};

/**
 * Journal exchange rate input field.
 * @returns {JSX.Element}
 */
export function JournalExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignJouranl = useJournalIsForeign();

  // Can't continue if the customer is not foreign.
  if (!isForeignJouranl) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      {...props}
    />
  );
}

/**
 *
 * @param {*} query
 * @param {*} journal
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const itemPredicate = (query, journal, _index, exactMatch) => {
  const normalizedTitle = journal.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

/**
 *
 * @param {*} item
 * @param {*} param1
 * @returns
 */
const itemRenderer = (item, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      text={item.name}
      label={item.label}
      key={item.id}
      onClick={handleClick}
    />
  );
};

const itemSelectProps = {
  itemPredicate: itemPredicate,
  itemRenderer: itemRenderer,
  valueAccessor: 'name',
  labelAccessor: 'name',
};

export function JournalTypeSelect({ items, ...rest }) {
  return (
    <FSelect
      {...itemSelectProps}
      {...rest}
      items={items}
      input={itemSelectButton}
    />
  );
}

/**
 * @param {*} label
 * @returns
 */
function itemSelectButton({ label }) {
  return (
    <Button
      text={label ? label : intl.get('make_journal.label.select_journal_type')}
    />
  );
}
