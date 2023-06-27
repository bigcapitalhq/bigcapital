// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Menu, MenuItem, Position, Button, Intent } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useFormikContext } from 'formik';
import * as R from 'ramda';

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
import withSettings from '@/containers/Settings/withSettings';
import { transactionNumber } from '@/utils';
import { useUpdateEffect } from '@/hooks';

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
        intent={Intent.DANGER}
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

  const isForeignJournal = useJournalIsForeign();

  // Can't continue if the customer is not foreign.
  if (!isForeignJournal) {
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
 * Syncs journal auto-increment settings to form.
 * @return {React.ReactNode}
 */
export const JournalSyncIncrementSettingsToForm = R.compose(
  withSettings(({ manualJournalsSettings }) => ({
    journalAutoIncrement: manualJournalsSettings?.autoIncrement,
    journalNextNumber: manualJournalsSettings?.nextNumber,
    journalNumberPrefix: manualJournalsSettings?.numberPrefix,
  })),
)(({ journalAutoIncrement, journalNextNumber, journalNumberPrefix }) => {
  const { setFieldValue } = useFormikContext();

  useUpdateEffect(() => {
    // Do not update if the journal auto-increment mode is disabled.
    if (!journalAutoIncrement) return null;

    setFieldValue(
      'journal_number',
      transactionNumber(journalNumberPrefix, journalNextNumber),
    );
  }, [
    setFieldValue,
    journalNumberPrefix,
    journalNextNumber,
    journalAutoIncrement,
  ]);

  return null;
});

JournalSyncIncrementSettingsToForm.displayName =
  'JournalSyncIncrementSettingsToForm';
