// @ts-nocheck
import React, { useRef } from 'react';
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
import {
  AppToaster,
  Icon,
  If,
  Stack,
  FormattedMessage as T,
} from '@/components';

import { dynamicColumns } from './utils';
import FinancialLoadingBar from '../FinancialLoadingBar';
import {
  useInventoryItemDetailsCsvExport,
  useInventoryItemDetailsXlsxExport,
} from '@/hooks/query';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';
import { FinancialComputeAlert } from '../FinancialReportPage';
import { useInventoryValuationHttpQuery } from './utils2';

/**
 * Retrieve inventory item details columns.
 */
export const useInventoryItemDetailsColumns = () => {
  const {
    inventoryItemDetails: { columns, tableRows },
  } = useInventoryItemDetailsContext();

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
  if (!inventoryItemDetails.meta.is_cost_compute_running) {
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
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const httpQuery = useInventoryValuationHttpQuery();

  const openProgressToast = (amount: number) => {
    return (
      <Stack spacing={8}>
        <Text>The report has been exported successfully.</Text>
        <ProgressBar
          className={classNames('toast-progress', {
            [Classes.PROGRESS_NO_STRIPES]: amount >= 100,
          })}
          intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
          value={amount / 100}
        />
      </Stack>
    );
  };

  // Export the report to xlsx.
  const { mutateAsync: xlsxExport } = useInventoryItemDetailsXlsxExport(
    httpQuery,
    {
      onDownloadProgress: (xlsxExportProgress: number) => {
        if (!toastKey.current) {
          toastKey.current = AppToaster.show({
            message: openProgressToast(xlsxExportProgress),
            ...commonToastConfig,
          });
        } else {
          AppToaster.show(
            {
              message: openProgressToast(xlsxExportProgress),
              ...commonToastConfig,
            },
            toastKey.current,
          );
        }
      },
    },
  );
  // Export the report to csv.
  const { mutateAsync: csvExport } = useInventoryItemDetailsCsvExport(
    httpQuery,
    {
      onDownloadProgress: (xlsxExportProgress: number) => {
        if (!toastKey.current) {
          toastKey.current = AppToaster.show({
            message: openProgressToast(xlsxExportProgress),
            ...commonToastConfig,
          });
        } else {
          AppToaster.show(
            {
              message: openProgressToast(xlsxExportProgress),
              ...commonToastConfig,
            },
            toastKey.current,
          );
        }
      },
    },
  );
  // Handle csv export button click.
  const handleCsvExportBtnClick = () => {
    csvExport();
  };
  // Handle xlsx export button click.
  const handleXlsxExportBtnClick = () => {
    xlsxExport();
  };

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
