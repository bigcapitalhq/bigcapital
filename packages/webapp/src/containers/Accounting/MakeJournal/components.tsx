import { Menu, MenuItem, Position, Button, Intent } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useJournalIsForeign, type MakeJournalFormValues } from './utils';
import { useMakeJournalFormContext } from './MakeJournalProvider';
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
import { useUpdateEffect } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { transactionNumber } from '@/utils';

type JournalExchangeRateInputFieldRootProps = Omit<
  React.ComponentProps<typeof ExchangeRateInputGroup>,
  'fromCurrency' | 'toCurrency' | 'onCancel' | 'onRecalcConfirm'
>;

/**
 * Contact header cell.
 */
export function ContactHeaderCell() {
  return (
    <>
      <T id={'contact'} />
      <Hint
        // @ts-expect-error Hint.content is typed as string but renders ReactNode via Tooltip
        content={<T id={'contact_column_hint'} />}
        position={Position.LEFT_BOTTOM}
      />
    </>
  );
}

type CurrencyHeaderCellProps = {
  payload: { currencyCode: string };
};

/**
 * Credit header cell.
 */
export function CreditHeaderCell({
  payload: { currencyCode },
}: CurrencyHeaderCellProps): string {
  return intl.get('credit_currency', { currency: currencyCode });
}

/**
 * debit header cell.
 */
export function DebitHeaderCell({
  payload: { currencyCode },
}: CurrencyHeaderCellProps): string {
  return intl.get('debit_currency', { currency: currencyCode });
}

type ActionsCellRendererProps = {
  row: { index: number };
  column: { id: string };
  cell: { value: unknown };
  data: unknown[];
  payload: { removeRow: (index: number) => void };
};

/**
 * Actions cell renderer.
 */
export const ActionsCellRenderer = ({
  row: { index },
  payload,
}: ActionsCellRendererProps) => {
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
        id: 'accountId',
        accessor: 'accountId',
        Cell: AccountsListFieldCell,
        disableSortBy: true,
        width: 160,
        fieldProps: { allowCreate: true },
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
        Header: CreditHeaderCell,
        accessor: 'credit',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 100,
        align: Align.Right,
      },
      {
        Header: ContactHeaderCell,
        id: 'contactId',
        accessor: 'contactId',
        Cell: ContactsListFieldCell,
        disableSortBy: true,
        width: 120,
      },

      ...(featureCan(Features.Branches)
        ? [
            {
              Header: intl.get('project'),
              id: 'projectId',
              accessor: 'projectId',
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
              id: 'branchId',
              accessor: 'branchId',
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
 */
export function JournalExchangeRateInputField({
  ...props
}: JournalExchangeRateInputFieldRootProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<MakeJournalFormValues>();

  const isForeignJournal = useJournalIsForeign();

  // Can't continue if the journal is not foreign.
  if (!isForeignJournal) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      {...props}
      fromCurrency={values.currencyCode}
      toCurrency={baseCurrency ?? ''}
    />
  );
}

/**
 * Syncs journal auto-increment settings to form.
 */
export const JournalSyncIncrementSettingsToForm = () => {
  const { setFieldValue } = useFormikContext<MakeJournalFormValues>();
  const { manualJournalsSettings } = useMakeJournalFormContext();

  const journalAutoIncrement = manualJournalsSettings?.autoIncrement as
    | boolean
    | undefined;
  const journalNextNumber = manualJournalsSettings?.nextNumber as
    | number
    | undefined;
  const journalNumberPrefix = manualJournalsSettings?.numberPrefix as
    | string
    | undefined;

  useUpdateEffect(() => {
    // Do not update if the journal auto-increment mode is disabled.
    if (!journalAutoIncrement) return;

    setFieldValue(
      'journalNumber',
      transactionNumber(journalNumberPrefix, journalNextNumber),
    );
  }, [
    setFieldValue,
    journalNumberPrefix,
    journalNextNumber,
    journalAutoIncrement,
  ]);

  return null;
};

JournalSyncIncrementSettingsToForm.displayName =
  'JournalSyncIncrementSettingsToForm';
