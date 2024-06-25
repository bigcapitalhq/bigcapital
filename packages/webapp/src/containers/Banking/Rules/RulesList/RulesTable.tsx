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

  // Handle edit bank rule.
  const handleDeleteBankRule = ({ id }) => {};

  // Handle delete bank rule.
  const handleEditBankRule = () => {};

  // Display invoice empty status instead of the table.
  if (isEmptyStatus) {
    return <BankRulesLandingEmptyState />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={[]}
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
        onCellClick={handleCellClick}
        size={'medium'}
        payload={{
          onDelete: handleDeleteTaxRate,
          onEdit: handleEditTaxRate,
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
