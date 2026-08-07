import {
  Button,
  Classes,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { FinancialComputeAlert } from '../FinancialReportPage';
import { useJournalSheetContext } from './JournalProvider';
import type { JournalXlsxQuery, JournalCsvQuery } from '@bigcapital/sdk-ts';
import {
  AppToaster,
  Icon,
  If,
  Stack,
  FormattedMessage as T,
} from '@/components';
import {
  useJournalSheetCsvExport,
  useJournalSheetXlsxExport,
} from '@/hooks/query';

/**
 * Journal sheet loading bar.
 */
export function JournalSheetLoadingBar() {
  const { isFetching } = useJournalSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Journal sheet alerts.
 */
export function JournalSheetAlerts() {
  const { isLoading, refetchSheet, journalSheet } = useJournalSheetContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    refetchSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }
  // Can't continue if the cost compute job is running.
  if (!(journalSheet as any)?.meta?.isCostComputeRunning) {
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
 * Retrieves the journal sheet export menu.
 * @returns {JSX.Element}
 */
export const JournalSheetExportMenu = () => {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useJournalSheetContext();

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

  const { mutateAsync: xlsxExport } = useJournalSheetXlsxExport(
    httpQuery as JournalXlsxQuery,
  );
  const { mutateAsync: csvExport } = useJournalSheetCsvExport(
    httpQuery as JournalCsvQuery,
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
