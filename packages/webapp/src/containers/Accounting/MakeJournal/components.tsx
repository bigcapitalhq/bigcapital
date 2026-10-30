import { Menu, MenuItem, Position, Button, Intent } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { useJournalIsForeign, type MakeJournalFormValues } from './utils';
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
  TrackingCategoryOptionFieldCell,
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
  const { trackingCategories, manualJournal } = useMakeJournalFormContext();

  // Archived categories are hidden for new journals, but remain visible on
  // edit when the journal already references them so history is preserved.
  const usedCategoryIds = React.useMemo(() => {
    return new Set(
      (manualJournal?.entries ?? []).flatMap((entry) =>
        (entry.trackingCategories ?? []).map(
          (assignment) => assignment.categoryId,
        ),
      ),
    );
  }, [manualJournal]);

  const visibleCategories = React.useMemo(() => {
    return trackingCategories.filter(
      (category) => !!category.active || usedCategoryIds.has(category.id),
    );
  }, [trackingCategories, usedCategoryIds]);

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
              Header: intl.get('branch'),
              id: 'branchId',
              accessor: 'branchId',
              Cell: BranchesListFieldCell,
              disableSortBy: true,
              width: 120,
            },
          ]
        : []),
      ...(featureCan(Features.TrackingCategories)
        ? visibleCategories.map((category) => ({
            Header: category.active
              ? category.name
              : `${category.name} (${intl.get(
                  'tracking_categories.status.archived',
                )})`,
            id: `tracking-category-${category.id}`,
            accessor: (entry: {
              trackingCategories?: Array<{
                categoryId: number;
                optionId: number;
              }>;
            }) =>
              entry.trackingCategories?.find(
                (assignment) => assignment.categoryId === category.id,
              )?.optionId,
            Cell: TrackingCategoryOptionFieldCell,
            trackingCategory: category,
            disableSortBy: true,
            width: 140,
          }))
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
    [featureCan, visibleCategories],
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
