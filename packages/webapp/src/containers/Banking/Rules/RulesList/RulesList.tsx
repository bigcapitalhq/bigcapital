// @ts-nocheck
import { DashboardPageContent } from '@/components';
import { RulesListBoot } from './RulesListBoot';
import { RulesListActionsBar } from './RulesListActionsBar';
import { BankRulesTable } from './RulesTable';
import React from 'react';

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
