import { NonIdealState } from '@blueprintjs/core';
import { useCallback, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { AuditLogActionsBar } from './AuditLogActionsBar';
import { AuditLogBody } from './AuditLogBody';
import { AuditLogHeader } from './AuditLogHeader';
import { AuditLogProvider } from './AuditLogProvider';
import { useAuditLogQuery } from './common';
import { AuditLogLoadingBar } from './components';
import {
  Card,
  Can,
  DashboardPageContent,
  FinancialStatement,
} from '@/components';
import { AbilitySubject, AuditLogAction } from '@/constants/abilityOption';

/**
 * Audit Log Report Content
 */
function AuditLogReportContent() {
  const { query, setLocationQuery } = useAuditLogQuery();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleFilterSubmit = useCallback(
    (filter: Record<string, unknown>) => {
      setLocationQuery(filter);
    },
    [setLocationQuery],
  );

  const toggleFilterDrawer = useCallback((toggle?: boolean) => {
    setIsFilterDrawerOpen((prev) =>
      typeof toggle !== 'undefined' ? toggle : !prev,
    );
  }, []);

  // Hide filter drawer on unmount
  useEffect(() => {
    return () => setIsFilterDrawerOpen(false);
  }, []);

  return (
    <AuditLogProvider query={query}>
      <AuditLogActionsBar
        isFilterDrawerOpen={isFilterDrawerOpen}
        toggleFilterDrawer={toggleFilterDrawer}
      />

      <DashboardPageContent>
        <FinancialStatement>
          <AuditLogHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
            isFilterDrawerOpen={isFilterDrawerOpen}
            toggleFilterDrawer={toggleFilterDrawer}
          />
          <AuditLogLoadingBar />
          <AuditLogBody />
        </FinancialStatement>
      </DashboardPageContent>
    </AuditLogProvider>
  );
}

/**
 * Audit Log Report page (in Financial Reports section).
 */
export function AuditLogReport() {
  return (
    <>
      <Can I={AuditLogAction.View} a={AbilitySubject.AuditLog}>
        <AuditLogReportContent />
      </Can>

      <Can not I={AuditLogAction.View} a={AbilitySubject.AuditLog}>
        <DashboardPageContent>
          <Card style={{ padding: 20 }}>
            <NonIdealState title={intl.get('audit_log.no_access')} />
          </Card>
        </DashboardPageContent>
      </Can>
    </>
  );
}
