// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Menu, MenuItem, Position, Button } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useFormikContext } from 'formik';

import {
  ExchangeRateInputGroup,
  Icon,
  Hint,
  FormattedMessage as T,
} from '@/components';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
  ContactsListFieldCell,
  BranchesListFieldCell,
  ProjectsListFieldCell,
} from '@/components/DataTableCells';

import { CellType, Features, Align } from '@/constants';

import { useCurrentOrganization, useFeatureCan } from '@/hooks/state';
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
              Header: intl.get('project'),
              id: 'project_id',
              accessor: 'project_id',
              Cell: ProjectsListFieldCell,
              className: 'project_id',
              disableSortBy: true,
              width: 120,
            },
          ]
        : []),

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
