// @ts-nocheck
import * as R from 'ramda';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonHeader,
  TableSkeletonRows,
} from '@/components';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

import { useBankRulesTableColumns } from './hooks';
import { BankRulesTableActionsMenu } from './_components';
import { BankRulesLandingEmptyState } from './BankRulesLandingEmptyState';
import { useRulesListBoot } from './RulesListBoot';

/**
 * Invoices datatable.
 */
function RulesTable({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,
}) {
  // Invoices table columns.
  const columns = useBankRulesTableColumns();

  const { bankRules } = useRulesListBoot();

  // Handle edit bank rule.
  const handleDeleteBankRule = ({ id }) => {
    openAlert('bank-rule-delete', { id });
  };

  // Handle delete bank rule.
  const handleEditBankRule = () => {};

  const isEmptyState = false;

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
        payload={{
          onDelete: handleDeleteBankRule,
          onEdit: handleEditBankRule,
        }}
      />
    </DashboardContentTable>
  );
}

export const BankRulesTable = R.compose(
  withDashboardActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
)(RulesTable);
