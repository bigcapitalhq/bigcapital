import { BP_Table as BlueprintTable } from '@bigcapitalhq/blueprintjs-react-table';
import { Intent } from '@blueprintjs/core';
import '@bigcapitalhq/blueprintjs-react-table/styles.css';
import * as FF from 'fp-ts/function';
import { TaxRatesTableActionsMenu } from './_components';
import { useTaxRatesTableColumns } from './_utils';
import { TaxRatesLandingEmptyState } from './TaxRatesLandingEmptyState';
import { useTaxRatesLandingContext } from './TaxRatesLandingProvider';
import type { TaxRate } from '@bigcapital/sdk-ts';
import {
  AppToaster,
  DashboardContentTable,
  MaterialProgressBar,
} from '@/components';
import {
  getDashboardTableProps,
  getRowId,
  onCellDetailClick,
  TABLE_LOADING_OPTIONS,
} from '@/components/Datatable/blueprintTable';
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

const EMPTY_ROWS: TaxRate[] = [];

interface TaxRatesDataTableProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDrawerActionsProps, 'openDrawer'>,
    Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Tax rates table.
 */
function TaxRatesDataTable({
  openAlert,
  openDrawer,
  openDialog,
}: TaxRatesDataTableProps) {
  // Tax rates list context.
  const { taxRates, isTaxRatesLoading, isTaxRatesFetching, isEmptyStatus } =
    useTaxRatesLandingContext();

  // Tax rates table columns.
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
  const payload = {
    onViewDetails: handleViewDetails,
    onDelete: handleDeleteTaxRate,
    onEdit: handleEditTaxRate,
    onActivate: handleActivateTaxRate,
    onInactivate: handleInactivateTaxRate,
  };
  if (isEmptyStatus) {
    return <TaxRatesLandingEmptyState />;
  }

  return (
    <DashboardContentTable>
      {isTaxRatesFetching && !isTaxRatesLoading && <MaterialProgressBar />}
      <BlueprintTable
        columns={columns}
        data={taxRates ?? EMPTY_ROWS}
        getRowId={getRowId}
        enableRowHeader={false}
        {...getDashboardTableProps(false)}
        enableSorting
        getCellProps={({ row, column }) => ({
          'data-testId': column.id === 'name' ? 'tax-rate-row' : undefined,
          onClick: onCellDetailClick(() => handleViewDetails(row.original)),
        })}
        enableGhostCells
        loadingOptions={isTaxRatesLoading ? TABLE_LOADING_OPTIONS : undefined}
        enableBodyContextMenu={!isTaxRatesFetching}
        bodyContextMenuRenderer={(context) => {
          const row = context.getTargetRow();
          return (
            row && <TaxRatesTableActionsMenu row={row} payload={payload} />
          );
        }}
      />
    </DashboardContentTable>
  );
}

export const TaxRatesLandingTable = FF.pipe(
  TaxRatesDataTable,
  withDialogActions,
  withDrawerActions,
  withAlertActions,
  withDashboardActions,
);
