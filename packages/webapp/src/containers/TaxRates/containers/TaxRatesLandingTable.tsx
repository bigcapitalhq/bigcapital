// @ts-nocheck
import React from 'react';
import { Intent } from '@blueprintjs/core';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonHeader,
  TableSkeletonRows,
  AppToaster,
} from '@/components';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withSettings from '@/containers/Settings/withSettings';

import { useTaxRatesTableColumns } from './_utils';
import { useTaxRatesLandingContext } from './TaxRatesLandingProvider';
import { TaxRatesLandingEmptyState } from './TaxRatesLandingEmptyState';
import { TaxRatesTableActionsMenu } from './_components';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';
import { DialogsName } from '@/constants/dialogs';
import {
  useActivateTaxRate,
  useInactivateTaxRate,
} from '@/hooks/query/taxRates';

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

  const { mutateAsync: activateTaxRateMutate } = useActivateTaxRate();
  const { mutateAsync: inactivateTaxRateMutate } = useInactivateTaxRate();

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
  // Handles activating the given tax rate.
  const handleActivateTaxRate = (taxRate) => {
    activateTaxRateMutate(taxRate.id)
      .then(() => {
        AppToaster.show({
          message: 'The tax rate has been activated successfully.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };
  // Handles inactivating the given tax rate.
  const handleInactivateTaxRate = (taxRate) => {
    inactivateTaxRateMutate(taxRate.id)
      .then(() => {
        AppToaster.show({
          message: 'The tax rate has been inactivated successfully.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
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
          onActivate: handleActivateTaxRate,
          onInactivate: handleInactivateTaxRate,
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
