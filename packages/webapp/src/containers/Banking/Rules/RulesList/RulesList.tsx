// @ts-nocheck
import React from 'react';
import { RulesListActionsBar } from './RulesListActionsBar';
import { RulesListBoot } from './RulesListBoot';
import { BankRulesTable } from './RulesTable';
import { DashboardPageContent } from '@/components';

/**
 * Renders the rules landing page.
 * @returns {React.ReactNode}
 */
export function RulesList() {
  return (
    <RulesListBoot>
      <RulesListActionsBar />

      <DashboardPageContent>
        <RulesListBoot>
          <BankRulesTable />
        </RulesListBoot>
      </DashboardPageContent>
    </RulesListBoot>
  );
}
