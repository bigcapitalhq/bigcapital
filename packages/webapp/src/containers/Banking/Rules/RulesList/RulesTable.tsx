import * as FF from 'fp-ts/function';
import { BankRulesTableActionsMenu } from './_components';
import { BankRulesLandingEmptyState } from './BankRulesLandingEmptyState';
import { useBankRulesTableColumns } from './hooks';
import { useRulesListBoot } from './RulesListBoot';
import type { BankRuleTableRow } from './hooks';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonHeader,
  TableSkeletonRows,
} from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface RulesTableProps
  extends WithAlertActionsProps,
    WithDialogActionsProps {}

/**
 * Retrieves the rules table.
 * @returns {React.ReactNode}
 */
function RulesTable({
  // #withAlertActions
  openAlert,

  // #withDialogAction
  openDialog,
}: RulesTableProps) {
  // Invoices table columns.
  const columns = useBankRulesTableColumns();
  const { bankRules, isEmptyState } = useRulesListBoot();

  // Handle edit bank rule.
  const handleDeleteBankRule = ({ id }: BankRuleTableRow) => {
    openAlert('bank-rule-delete', { id });
  };

  // Handle delete bank rule.
  const handleEditBankRule = ({ id }: BankRuleTableRow) => {
    openDialog(DialogsName.BankRuleForm, { bankRuleId: id });
  };

  // Display invoice empty status instead of the table.
  if (isEmptyState) {
    return <BankRulesLandingEmptyState />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={bankRules}
        loading={false}
        headerLoading={false}
        progressBarLoading={false}
        manualSortBy={false}
        selectionColumn={false}
        noInitialFetch={true}
        sticky={true}
        pagination={false}
        manualPagination={false}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={BankRulesTableActionsMenu}
        // onCellClick={handleCellClick}
        size={'medium'}
        rowTestId={'bank-rule-row'}
        payload={{
          onDelete: handleDeleteBankRule,
          onEdit: handleEditBankRule,
        }}
      />
    </DashboardContentTable>
  );
}

export const BankRulesTable = FF.pipe(
  RulesTable,
  withDialogActions,
  withAlertActions,
);
