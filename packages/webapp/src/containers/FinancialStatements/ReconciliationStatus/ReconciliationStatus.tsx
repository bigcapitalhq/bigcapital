import {
  Alignment,
  Button,
  NavbarDivider,
  NavbarGroup,
  NonIdealState,
  SegmentedControl,
} from '@blueprintjs/core';
import moment from 'moment';
import { useState } from 'react';
import intl from 'react-intl-universal';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import {
  FinancialReportBody,
  FinancialReportPage,
} from '../FinancialReportPage';
import { ReconciliationStatusExportActions } from './ReconciliationStatusExportActions';
import { ReconciliationStatusFilters } from './ReconciliationStatusFilters';
import { ReconciliationStatusTable } from './ReconciliationStatusTable';
import type { ReconciliationStatusFilterValues } from './ReconciliationStatusFilters';
import type { ReconciliationStatusReportQuery } from '@bigcapital/sdk-ts';
import {
  Can,
  DashboardActionsBar,
  DashboardPageContent,
  FinancialSheet,
  FinancialSheetSkeleton,
  FinancialStatement,
  FormattedMessage as T,
  Icon,
} from '@/components';
import { AbilitySubject, ReportsAction } from '@/constants/abilityOption';
import { useReconciliationStatus } from '@/hooks/query/FinancialReports/use-reconciliation-status';

function ReconciliationStatusReport() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);
  const today = moment().locale('en');
  const filters = {
    accountId: params.get('accountId') ?? '',
    fromDate:
      params.get('fromDate') ??
      today.clone().startOf('month').format('YYYY-MM-DD'),
    toDate: params.get('toDate') ?? today.format('YYYY-MM-DD'),
  };
  const { accountId, fromDate, toDate } = filters;
  const status = params.get('status') === 'U' ? 'U' : 'R';
  const reportQuery: ReconciliationStatusReportQuery = {
    accountId: accountId ? Number(accountId) : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    status,
  };
  const { data, isFetching, isPending, isPlaceholderData, isError, refetch } =
    useReconciliationStatus(reportQuery);

  const applyFilters = (
    values: ReconciliationStatusFilterValues,
    mode = status,
  ) => {
    const nextSearch = `?${new URLSearchParams({ ...values, status: mode }).toString()}`;
    if (nextSearch === search) {
      void refetch();
    } else {
      history.push({ search: nextSearch });
    }
  };

  const selectMode = (mode: string) => {
    if ((mode === 'R' || mode === 'U') && mode !== status) {
      applyFilters(filters, mode);
    }
  };

  return (
    <FinancialReportPage name="reconciliation-status">
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className="button--gray-highlight"
            minimal
            icon={<Icon icon="refresh-16" iconSize={16} />}
            text={<T id="recalc_report" />}
            onClick={() => refetch()}
          />
          <NavbarDivider />
          <Button
            className="button--table-views"
            minimal
            icon={<Icon icon="cog-16" iconSize={16} />}
            text={
              <T id={isFilterOpen ? 'hide_customizer' : 'customize_report'} />
            }
            active={isFilterOpen}
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((open) => !open)}
          />
          <NavbarDivider />
          <ReconciliationStatusExportActions
            query={reportQuery}
            disabled={!data || isPlaceholderData || isError}
          />
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <div
            id="reconciliation-status-modes"
            role="group"
            aria-label={intl.get('status')}
          >
            <SegmentedControl
              size="small"
              intent="primary"
              aria-label={intl.get('status')}
              value={status}
              onValueChange={selectMode}
              options={[
                {
                  label: intl.get('report.reconciliation_status.reconciled'),
                  value: 'R',
                },
                {
                  label: intl.get('report.reconciliation_status.unreconciled'),
                  value: 'U',
                },
              ]}
            />
          </div>
        </NavbarGroup>
      </DashboardActionsBar>
      <DashboardPageContent>
        <FinancialStatement>
          <ReconciliationStatusFilters
            filters={filters}
            bankAccounts={data?.bankAccounts ?? []}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApply={(values) => {
              applyFilters(values);
              setIsFilterOpen(false);
            }}
          />
          {isFetching && <FinancialLoadingBar />}
          <FinancialReportBody>
            {isPending || isPlaceholderData ? (
              <FinancialSheetSkeleton fullWidth />
            ) : (
              <ReconciliationSheet
                companyName={data?.meta.organizationName}
                sheetType={
                  data?.meta.sheetName ??
                  intl.get('report.reconciliation_status.title')
                }
                dateText={data?.meta.formattedDateRange}
                fullWidth
              >
                {isError ? (
                  <NonIdealState
                    title={intl.get('report.reconciliation_status.load_error')}
                    action={
                      <Button onClick={() => refetch()}>
                        <T id="report.reconciliation_status.retry" />
                      </Button>
                    }
                  />
                ) : (
                  <ReconciliationStatusTable table={data.table} />
                )}
              </ReconciliationSheet>
            )}
          </FinancialReportBody>
        </FinancialStatement>
      </DashboardPageContent>
    </FinancialReportPage>
  );
}

const ReconciliationSheet = styled(FinancialSheet)`
  min-width: 0;
`;

export function ReconciliationStatus() {
  return (
    <>
      <Can
        I={ReportsAction.READ_RECONCILIATION_STATUS}
        a={AbilitySubject.Report}
      >
        <ReconciliationStatusReport />
      </Can>
      <Can
        not
        I={ReportsAction.READ_RECONCILIATION_STATUS}
        a={AbilitySubject.Report}
      >
        <DashboardPageContent>
          <NonIdealState
            title={intl.get('report.reconciliation_status.no_access')}
          />
        </DashboardPageContent>
      </Can>
    </>
  );
}
