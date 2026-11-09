import {
  Button,
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { FinancialComputeAlert } from '../FinancialReportPage';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';
import { dynamicColumns } from './utils';
import { useInventoryValuationHttpQuery } from './utils2';
import type {
  InventoryItemDetailsXlsxQuery,
  InventoryItemDetailsCsvQuery,
} from '@bigcapital/sdk-ts';
import {
  AppToaster,
  Icon,
  If,
  Stack,
  FormattedMessage as T,
} from '@/components';
import {
  useInventoryItemDetailsCsvExport,
  useInventoryItemDetailsXlsxExport,
} from '@/hooks/query';

/**
 * Retrieve inventory item details columns.
 */
export const useInventoryItemDetailsColumns = () => {
  const { inventoryItemDetails } = useInventoryItemDetailsContext();
  const columns = (inventoryItemDetails as any)?.columns ?? [];
  const tableRows = (inventoryItemDetails as any)?.tableRows ?? [];

  return React.useMemo(
    () => dynamicColumns(columns, tableRows),
    [columns, tableRows],
  );
};

/**
 * inventory item details  loading bar.
 */
export function InventoryItemDetailsLoadingBar() {
  const { isInventoryItemDetailsFetching } = useInventoryItemDetailsContext();

  return (
    <If condition={isInventoryItemDetailsFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * inventory item details alerts
 */
export function InventoryItemDetailsAlerts() {
  const {
    inventoryItemDetails,
    isInventoryItemDetailsLoading,
    inventoryItemDetailsRefetch,
  } = useInventoryItemDetailsContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    inventoryItemDetailsRefetch();
  };

  // Can't display any error if the report is loading
  if (isInventoryItemDetailsLoading) {
    return null;
  }
  // Can't continue if the cost compute job is running.
  if (!(inventoryItemDetails as any)?.meta?.isCostComputeRunning) {
    return null;
  }

  return (
    <FinancialComputeAlert>
      <Icon icon="info-block" iconSize={12} />
      <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />

      <Button onClick={handleRecalcReport} minimal={true} small={true}>
        <T id={'refresh'} />
      </Button>
    </FinancialComputeAlert>
  );
}

/**
 * Inventory item details export menu.
 * @returns {JSX.Element}
 */
export function InventoryItemDetailsExportMenu() {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const httpQuery = useInventoryValuationHttpQuery();

  const renderToast = (done: boolean) => {
    return (
      <Stack spacing={8}>
        <Text>
          {done
            ? 'The report has been exported successfully.'
            : 'Exporting the report…'}
        </Text>
        <ProgressBar
          className={classNames('toast-progress', {
            [Classes.PROGRESS_NO_STRIPES]: done,
          })}
          intent={done ? Intent.SUCCESS : Intent.PRIMARY}
          value={done ? 1 : undefined}
        />
      </Stack>
    );
  };

  const { mutateAsync: xlsxExport } = useInventoryItemDetailsXlsxExport(
    httpQuery as InventoryItemDetailsXlsxQuery,
  );
  const { mutateAsync: csvExport } = useInventoryItemDetailsCsvExport(
    httpQuery as InventoryItemDetailsCsvQuery,
  );

  const runExport = async (mutate: () => Promise<unknown>) => {
    const key = AppToaster.show({
      message: renderToast(false),
      ...commonToastConfig,
      timeout: 0,
    });
    try {
      await mutate();
      AppToaster.show(
        { message: renderToast(true), ...commonToastConfig },
        key,
      );
    } catch {
      AppToaster.dismiss(key);
    }
  };

  const handleCsvExportBtnClick = () => runExport(csvExport);
  const handleXlsxExportBtnClick = () => runExport(xlsxExport);

  return (
    <Menu>
      <MenuItem
        text={'XLSX (Microsoft Excel)'}
        onClick={handleXlsxExportBtnClick}
      />
      <MenuItem text={'CSV'} onClick={handleCsvExportBtnClick} />
    </Menu>
  );
}
