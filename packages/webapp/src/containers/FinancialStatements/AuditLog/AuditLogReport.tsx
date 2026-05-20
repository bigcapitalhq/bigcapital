// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { NonIdealState } from '@blueprintjs/core';
import {
  Card,
  Can,
  DashboardPageContent,
  FinancialStatement,
} from '@/components';
import { AbilitySubject, AuditLogAction } from '@/constants/abilityOption';

import { AuditLogProvider } from './AuditLogProvider';
import AuditLogHeader from './AuditLogHeader';
import AuditLogActionsBar from './AuditLogActionsBar';
import { AuditLogLoadingBar } from './components';
import { AuditLogBody } from './AuditLogBody';
import { useAuditLogQuery } from './common';

/**
 * Audit Log Report Content
 */
function AuditLogReportContent() {
  const { query, setLocationQuery } = useAuditLogQuery();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleFilterSubmit = useCallback(
    (filter) => {
      setLocationQuery(filter);
    },
    [setLocationQuery]
  );

  const toggleFilterDrawer = useCallback((toggle) => {
    setIsFilterDrawerOpen((prev) =>
      typeof toggle !== 'undefined' ? toggle : !prev
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
function AuditLogReport() {
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

export default AuditLogReport;
