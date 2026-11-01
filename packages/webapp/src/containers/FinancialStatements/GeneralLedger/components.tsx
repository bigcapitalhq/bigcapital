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
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import type {
  GeneralLedgerXlsxQuery,
  GeneralLedgerCsvQuery,
} from '@bigcapital/sdk-ts';
import {
  FormattedMessage as T,
  Icon,
  If,
  Stack,
  AppToaster,
} from '@/components';
import {
  useGeneralLedgerSheetCsvExport,
  useGeneralLedgerSheetXlsxExport,
} from '@/hooks/query';

/**
 * General ledger sheet alerts.
 */
export function GeneralLedgerSheetAlerts() {
  const { generalLedger, isLoading, sheetRefresh } = useGeneralLedgerContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    sheetRefresh();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }
  // Can't continue if the cost compute job is not running.
  const meta = (generalLedger as any)?.meta;
  if (!meta?.isCostComputeRunning) {
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
 * General ledger sheet loading bar.
 */
export function GeneralLedgerSheetLoadingBar() {
  const { isFetching } = useGeneralLedgerContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Renders the G/L sheet export menu.
 * @returns {JSX.Element}
 */
export const GeneralLedgerSheetExportMenu = () => {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useGeneralLedgerContext();

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

  const { mutateAsync: xlsxExport } = useGeneralLedgerSheetXlsxExport(
    httpQuery as GeneralLedgerXlsxQuery,
  );
  const { mutateAsync: csvExport } = useGeneralLedgerSheetCsvExport(
    httpQuery as GeneralLedgerCsvQuery,
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
};
