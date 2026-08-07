import { Intent } from '@blueprintjs/core';
import { TaxRatesTableActionsMenu } from './_components';
import { useTaxRatesTableColumns } from './_utils';
import { TaxRatesLandingEmptyState } from './TaxRatesLandingEmptyState';
import { useTaxRatesLandingContext } from './TaxRatesLandingProvider';
import type { TaxRate } from '@bigcapital/sdk-ts';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonHeader,
  TableSkeletonRows,
  AppToaster,
} from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import {
  useActivateTaxRate,
  useInactivateTaxRate,
} from '@/hooks/query/tax-rates';
import { compose } from '@/utils';

interface TaxRatesDataTableProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDrawerActionsProps, 'openDrawer'>,
    Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Invoices datatable.
 */
function TaxRatesDataTable({
  openAlert,
  openDrawer,
  openDialog,
}: TaxRatesDataTableProps) {
  // Invoices list context.
  const { taxRates, isTaxRatesLoading, isEmptyStatus } =
    useTaxRatesLandingContext();

  // Invoices table columns.
  const columns = useTaxRatesTableColumns();

  const { mutateAsync: activateTaxRateMutate } = useActivateTaxRate();
  const { mutateAsync: inactivateTaxRateMutate } = useInactivateTaxRate();

  // Handle delete tax rate.
  const handleDeleteTaxRate = ({ id }: { id: number }) => {
    openAlert('tax-rate-delete', { taxRateId: id });
  };
  // Handle edit tax rate.
  const handleEditTaxRate = (taxRate: TaxRate) => {
    openDialog(DialogsName.TaxRateForm, { id: taxRate.id });
  };
  // Handle view details tax rate.
  const handleViewDetails = (taxRate: TaxRate) => {
    openDrawer(DRAWERS.TAX_RATE_DETAILS, { taxRateId: taxRate.id });
  };
  // Handle table cell click.
  const handleCellClick = (
    cell: { row: { original: TaxRate } },
    event: unknown,
  ) => {
    openDrawer(DRAWERS.TAX_RATE_DETAILS, { taxRateId: cell.row.original.id });
  };
  // Handles activating the given tax rate.
  const handleActivateTaxRate = (taxRate: TaxRate) => {
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
  const handleInactivateTaxRate = (taxRate: TaxRate) => {
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
        data={taxRates ?? []}
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

export const TaxRatesLandingTable = compose(
  withDashboardActions,
  withAlertActions,
  withDrawerActions,
  withDialogActions,
)(TaxRatesDataTable);
