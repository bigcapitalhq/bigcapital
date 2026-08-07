import { isEmpty } from 'lodash';
import type { ReactNode } from 'react';
import { useAbilityContext } from '@/hooks';

export interface FinancialReport {
  ability: string;
  subject: string;
  [key: string]: unknown;
}

export interface FinancialSection {
  sectionTitle: ReactNode;
  reports: FinancialReport[];
}

export function useFilterFinancialReports(
  financialSection: FinancialSection[],
) {
  const ability = useAbilityContext();

  const section = financialSection
    .map((section) => {
      const reports = section.reports.filter((report) => {
        return ability.can(report.ability, report.subject);
      });

      return {
        sectionTitle: section.sectionTitle,
        reports,
      };
    })
    .filter(({ reports }) => !isEmpty(reports));

  return section;
}
