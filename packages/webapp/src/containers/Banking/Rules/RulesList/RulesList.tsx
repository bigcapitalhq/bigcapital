// @ts-nocheck
import { DashboardPageContent } from '@/components';
import { RulesListBoot } from './RulesListBoot';
import { RulesListActionsBar } from './RulesListActionsBar';
import { BankRulesTable } from './RulesTable';

/**
 *
 */
export function RulesList() {
  return (
    <RulesListBoot>
      <RulesListActionsBar />

      <DashboardPageContent>
        <BankRulesTable />
      </DashboardPageContent>
    </RulesListBoot>
  );
}
