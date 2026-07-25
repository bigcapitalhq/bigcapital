import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useExpensesListContext } from './ExpensesListProvider';
import { useBulkDeleteExpensesDialog } from './hooks/use-bulk-delete-expenses-dialog';
import { withExpenses } from './withExpenses';
import { withExpensesActions } from './withExpensesActions';
import type { WithExpensesProps } from './withExpenses';
import type { WithExpensesActionsProps } from './withExpensesActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  If,
  Can,
  Icon,
  DashboardRowsHeightButton,
  DashboardActionViewsList,
  DashboardActionsBar,
  DashboardFilterButton,
  AdvancedFilterPopover,
  FormattedMessage as T,
} from '@/components';
import { ExpenseAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useRefreshExpenses } from '@/hooks/query/expenses';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useSaveSettings } from '@/hooks/query';
import type { IFilterRole } from '@/components/AdvancedFilter/interfaces';
import { compose } from '@/utils';

interface ExpensesActionsBarInnerProps
  extends Pick<WithExpensesActionsProps, 'setExpensesTableState'>,
    Pick<WithDialogActionsProps, 'openDialog'>,
    Pick<WithExpensesProps, 'expensesSelectedRows'> {
  expensesFilterConditions: IFilterRole[];
}

/**
 * Expenses actions bar.
 */
function ExpensesActionsBar({
  //#withExpensesActions
  setExpensesTableState,

  // #withExpenses
  expensesFilterConditions,
  expensesSelectedRows = [],

  // #withDialogActions
  openDialog,
}: ExpensesActionsBarInnerProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  // History context.
  const history = useHistory();

  // Expenses list context.
  const { expensesViews, fields, expenseSettings } = useExpensesListContext();
  const expensesTableSize = expenseSettings?.tableSize as string | undefined;

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Expenses refresh action.
  const { refresh } = useRefreshExpenses();

  // Handles the new expense buttn click.
  const onClickNewExpense = () => {
    history.push('/expenses/new');
  };
  const { openBulkDeleteDialog, isValidatingBulkDeleteExpenses } =
    useBulkDeleteExpensesDialog();

  // Handle delete button click.
  const handleBulkDelete = () => {
    openBulkDeleteDialog(expensesSelectedRows);
  };

  // Handles the tab chaning.
  const handleTabChange = (view: { slug?: string | null } | null) => {
    setExpensesTableState({
      viewSlug: view ? view.slug : null,
    });
  };
  // Handle click a refresh
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle the import button click.
  const handleImportBtnClick = () => {
    history.push('/expenses/import');
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size: unknown) => {
    saveSettings({
      options: [{ group: 'expenses', key: 'tableSize', value: size }],
    });
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'expense' });
  };
  // Handles the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'Expense' });
  };

  if (!isEmpty(expensesSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteExpenses}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'expenses'}
          views={expensesViews}
          allMenuItem={true}
          allMenuItemText={null}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={ExpenseAction.Create} a={AbilitySubject.Expense}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'new_expense'} />}
            onClick={onClickNewExpense}
          />
        </Can>
        <AdvancedFilterPopover
          popoverProps={{ minimal: true }}
          advancedFilterProps={{
            conditions: expensesFilterConditions,
            defaultFieldKey: 'reference_no',
            fields: fields,
            onFilterChange: (filterConditions: IFilterRole[]) => {
              setExpensesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={expensesFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={expensesTableSize}
          value={expensesTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const ExpenseActionsBar = compose(
  withDialogActions,
  withExpensesActions,
  withExpenses(({ expensesTableState, expensesSelectedRows }) => ({
    expensesFilterConditions: expensesTableState.filterRoles,
    expensesSelectedRows,
  })),
)(ExpensesActionsBar);
