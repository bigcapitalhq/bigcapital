import React from 'react';
import { Intent, Position, Button, Tooltip } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { Icon, Hint, FormattedMessage as T } from 'components';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
  ContactsListFieldCell,
  BranchesListFieldCell,
} from 'components/DataTableCells';
import { useFeatureCan } from 'hooks/state';
import { useFormikContext } from 'formik';
import { ExchangeRateInputGroup } from 'components';
import { useCurrentOrganization } from 'hooks/state';
import { useJournalIsForeign } from './utils';
import { Features } from 'common';

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
  const { featureCan } = useFeatureCan();

  return React.useMemo(
    () => [
      {
        Header: intl.get('account'),
        id: 'account_id',
        accessor: 'account_id',
        Cell: AccountsListFieldCell,
        className: 'account',
        disableSortBy: true,
        width: 160,
        fieldProps: { allowCreate: true },
      },
      {
        Header: CreditHeaderCell,
        accessor: 'credit',
        Cell: MoneyFieldCell,
        className: 'credit',
        disableSortBy: true,
        width: 100,
      },
      {
        Header: DebitHeaderCell,
        accessor: 'debit',
        Cell: MoneyFieldCell,
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
      ...(featureCan(Features.Branches)
        ? [
            {
              Header: intl.get('branch'),
              id: 'branch_id',
              accessor: 'branch_id',
              Cell: BranchesListFieldCell,
              className: 'branch',
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
