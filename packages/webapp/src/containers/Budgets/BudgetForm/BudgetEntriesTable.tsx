import { BP_Table as BlueprintTable } from '@bigcapitalhq/blueprintjs-react-table';
import { Button, Classes } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { useField, useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import '@bigcapitalhq/blueprintjs-react-table/styles.css';
import { useBudgetFormContext } from './BudgetFormProvider';
import { BudgetPrefillPopover } from './BudgetPrefillPopover';
import {
  formatAmountInput,
  getAccountEntriesTotal,
  getEntryFieldKey,
  getVisibleBudgetAccounts,
  sanitizeAmountInput,
} from './utils';
import type { BudgetAccountRow, BudgetFormValues, BudgetPeriod } from './types';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { EmptyStatus, Group, Icon } from '@/components';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { formattedAmount } from '@/utils';

const column = createColumnHelper<BP_TableFeatures, BudgetAccountRow>();

interface BudgetAmountCellProps {
  accountId: number;
  accountName: string;
  period: BudgetPeriod;
}

/**
 * Editable budget amount cell.
 */
function BudgetAmountCell({
  accountId,
  accountName,
  period,
}: BudgetAmountCellProps) {
  const fieldName = `entries.${getEntryFieldKey(accountId, period.key)}`;
  const [field, , helpers] = useField<string>(fieldName);

  // Handles the amount input change.
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(sanitizeAmountInput(event.currentTarget.value));
  };

  // Formats the amount on blur.
  const handleBlur = () => {
    helpers.setValue(formatAmountInput(field.value));
  };

  return (
    <input
      className={classNames(Classes.INPUT, 'budget-entry-input')}
      type={'text'}
      inputMode={'decimal'}
      autoComplete={'off'}
      value={field.value ?? ''}
      placeholder={'0'}
      aria-label={`${accountName} ${period.label}`}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={(event) => event.currentTarget.select()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      }}
    />
  );
}

interface BudgetRowTotalCellProps {
  accountId: number;
  periods: BudgetPeriod[];
  currencyCode?: string;
}

/**
 * The total budgeted amount of the account row.
 */
function BudgetRowTotalCell({
  accountId,
  periods,
  currencyCode,
}: BudgetRowTotalCellProps) {
  const { values } = useFormikContext<BudgetFormValues>();
  const total = getAccountEntriesTotal(values, accountId, periods);

  return (
    <span className={'budget-account-total'}>
      {formattedAmount(total, currencyCode, { noZero: true })}
    </span>
  );
}

interface BudgetEntriesTableProps {
  periods: BudgetPeriod[];
}

/**
 * Budget entries table.
 */
export function BudgetEntriesTable({ periods }: BudgetEntriesTableProps) {
  const { accountRows } = useBudgetFormContext();
  const { values, setFieldValue } = useFormikContext<BudgetFormValues>();
  const currencyCode = useCurrentOrganizationBaseCurrency();

  const visibleAccounts = React.useMemo(
    () =>
      getVisibleBudgetAccounts(accountRows, values.includeBalanceSheetAccounts),
    [accountRows, values.includeBalanceSheetAccounts],
  );

  const columns = React.useMemo(
    () =>
      column.columns([
        column.accessor('code', {
          id: 'code',
          header: intl.get('budget.form.code'),
          size: 90,
        }),
        column.accessor('name', {
          id: 'name',
          header: intl.get('budget.form.account'),
          size: 230,
          cell: ({ getValue }) => (
            <span className={'budget-account-name'}>{getValue()}</span>
          ),
        }),
        column.accessor('accountTypeLabel', {
          id: 'type',
          header: intl.get('budget.form.account_type'),
          size: 130,
          cell: ({ getValue }) => (
            <span className={Classes.TEXT_MUTED}>{getValue()}</span>
          ),
        }),
        ...periods.map((period) =>
          column.display({
            id: period.key,
            header: period.label,
            size: 130,
            meta: {
              textAlign: 'right',
              tabularNums: true,
              bodyCellClassName: 'budget-entry-cell',
            },
            cell: ({ row }) => (
              <BudgetAmountCell
                accountId={row.original.id}
                accountName={row.original.name}
                period={period}
              />
            ),
          }),
        ),
        column.display({
          id: 'total',
          header: intl.get('budget.form.total'),
          size: 140,
          meta: {
            textAlign: 'right',
            tabularNums: true,
            bodyCellClassName: 'budget-total-cell',
          },
          cell: ({ row }) => (
            <BudgetRowTotalCell
              accountId={row.original.id}
              periods={periods}
              currencyCode={currencyCode}
            />
          ),
        }),
      ]),
    [periods, currencyCode],
  );

  // Handles clearing all budget entries.
  const handleClearEntries = () => {
    setFieldValue('entries', {});
  };

  if (visibleAccounts.length === 0) {
    return <EmptyStatus title={intl.get('budget.form.no_accounts')} />;
  }

  if (periods.length === 0) {
    return <EmptyStatus title={intl.get('budget.form.select_period')} />;
  }

  return (
    <div className={'budget-entries'}>
      <Group
        spacing={10}
        position={'apart'}
        className={'budget-entries__toolbar'}
      >
        <Group spacing={8}>
          <BudgetPrefillPopover periods={periods} />
          <Button
            icon={<Icon icon={'eraser'} />}
            text={intl.get('budget.form.clear_entries')}
            onClick={handleClearEntries}
          />
        </Group>
        <span className={Classes.TEXT_MUTED}>
          {intl.get('budget.form.entries_count', {
            count: visibleAccounts.length,
          })}
        </span>
      </Group>

      <div className={'budget-entries__table'}>
        <BlueprintTable<BudgetAccountRow>
          columns={columns}
          data={visibleAccounts}
          getRowId={(row) => String(row.id)}
          enableRowHeader={false}
          enableRowVirtualization={true}
          overscanRowCount={10}
          rowHeight={42}
          numFrozenColumns={2}
          enableGhostCells={true}
          columnHeaderHeight={36}
        />
      </div>
    </div>
  );
}
