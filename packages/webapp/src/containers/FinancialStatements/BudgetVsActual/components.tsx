import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  NonIdealState,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useBudgetVsActualContext } from './BudgetVsActualBoot';
import type {
  BudgetVsActualCsvQuery,
  BudgetVsActualXlsxQuery,
} from '@bigcapital/sdk-ts';
import { AppToaster, Card, Stack } from '@/components';
import {
  useBudgetVsActualCsvExport,
  useBudgetVsActualXlsxExport,
} from '@/hooks/query';

/**
 * Budget vs actual loading bar.
 */
export function BudgetVsActualLoadingBar() {
  const { isFetching } = useBudgetVsActualContext();

  if (!isFetching) {
    return null;
  }
  return <FinancialLoadingBar />;
}

/**
 * Budget vs actual export menu.
 */
export function BudgetVsActualExportMenu() {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useBudgetVsActualContext();

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

  const { mutateAsync: xlsxExport } = useBudgetVsActualXlsxExport(
    query as BudgetVsActualXlsxQuery,
  );
  const { mutateAsync: csvExport } = useBudgetVsActualCsvExport(
    query as BudgetVsActualCsvQuery,
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

/**
 * Empty status shown when the organization has no budgets yet.
 */
export function BudgetVsActualNoBudgetsState() {
  return (
    <Card style={{ padding: 20 }}>
      <NonIdealState
        icon={'comparison'}
        title={intl.get('budget_vs_actual.no_budgets')}
        description={intl.get('budget_vs_actual.no_budgets_desc')}
      />
    </Card>
  );
}

/**
 * Empty status shown when no budget is selected to compute the report on.
 */
export function BudgetVsActualSelectBudgetState() {
  return (
    <Card style={{ padding: 20 }}>
      <NonIdealState
        icon={'path-search'}
        title={intl.get('budget_vs_actual.select_budget')}
      />
    </Card>
  );
}
