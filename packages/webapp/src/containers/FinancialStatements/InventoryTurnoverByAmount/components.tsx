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
import { useInventoryTurnoverByAmountContext } from './InventoryTurnoverByAmountProvider';
import type {
  InventoryTurnoverByAmountCsvQuery,
  InventoryTurnoverByAmountXlsxQuery,
} from '@bigcapital/sdk-ts';
import {
  AppToaster,
  FormattedMessage as T,
  Icon,
  If,
  Stack,
} from '@/components';
import {
  useInventoryTurnoverByAmountCsvExport,
  useInventoryTurnoverByAmountXlsxExport,
} from '@/hooks/query';

/**
 * Inventory turnover by amount loading bar.
 */
export function InventoryTurnoverByAmountLoadingBar() {
  const { isFetching } = useInventoryTurnoverByAmountContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Inventory turnover by amount alerts.
 */
export function InventoryTurnoverByAmountAlerts() {
  const { inventoryTurnoverByAmount, isLoading, refetchSheet } =
    useInventoryTurnoverByAmountContext();

  const handleRecalcReport = () => {
    refetchSheet();
  };

  if (isLoading) {
    return null;
  }
  if (!(inventoryTurnoverByAmount as any)?.meta?.isCostComputeRunning) {
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
 * Inventory turnover by amount export menu.
 */
export function InventoryTurnoverByAmountExportMenu() {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useInventoryTurnoverByAmountContext();

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

  const { mutateAsync: xlsxExport } = useInventoryTurnoverByAmountXlsxExport(
    httpQuery as InventoryTurnoverByAmountXlsxQuery,
  );
  const { mutateAsync: csvExport } = useInventoryTurnoverByAmountCsvExport(
    httpQuery as InventoryTurnoverByAmountCsvQuery,
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
