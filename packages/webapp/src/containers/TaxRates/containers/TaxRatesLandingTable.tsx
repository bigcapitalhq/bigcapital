// @ts-nocheck
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
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
import withSettings from '@/containers/Settings/withSettings';

// import { useMemorizedColumnsWidths } from '@/hooks';
// import { ActionsMenu } from './components';
// import { useInvoicesListContext } from './InvoicesListProvider';

import { useTaxRatesTableColumns } from './_utils';
import { useTaxRatesLandingContext } from './TaxRatesLandingProvider';
import { TaxRatesLandingEmptyState } from './TaxRatesLandingEmptyState';
import { TaxRatesTableActionsMenu } from './_components';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';
import { DialogsName } from '@/constants/dialogs';

/**
 * Invoices datatable.
 */
function TaxRatesDataTable({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,
}) {
  // Invoices list context.
  const { taxRates, isTaxRatesLoading, isEmptyStatus } =
    useTaxRatesLandingContext();

  // Invoices table columns.
  const columns = useTaxRatesTableColumns();

  // Handle delete tax rate.
  const handleDeleteTaxRate = ({ id }) => {
    openAlert('tax-rate-delete', { taxRateId: id });
  };
  // Handle edit tax rate.
  const handleEditTaxRate = (taxRate) => {
    openDialog(DialogsName.TaxRateForm, { id: taxRate.id });
  };
  // Handle view details tax rate.
  const handleViewDetails = (taxRate) => {
    openDrawer(DRAWERS.TAX_RATE_DETAILS, { taxRateId: taxRate.id });
  };
  // Handle table cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.TAX_RATE_DETAILS, { taxRateId: cell.row.original.id });
  };
  // Display invoice empty status instead of the table.
  if (isEmptyStatus) {
    return <TaxRatesLandingEmptyState />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={taxRates}
        loading={isTaxRatesLoading}
        headerLoading={isTaxRatesLoading}
        progressBarLoading={isTaxRatesLoading}
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
        ContextMenu={TaxRatesTableActionsMenu}
        onCellClick={handleCellClick}
        size={'medium'}
        payload={{
          onViewDetails: handleViewDetails,
          onDelete: handleDeleteTaxRate,
          onEdit: handleEditTaxRate,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withDashboardActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
  withSettings(({ invoiceSettings }) => ({
    invoicesTableSize: invoiceSettings?.tableSize,
  })),
)(TaxRatesDataTable);
