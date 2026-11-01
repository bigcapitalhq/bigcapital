import { isEmpty } from 'lodash';
import type { ReactNode } from 'react';
import { useAbilityContext } from '@/hooks';
import { useFeatureCan } from '@/hooks/state';

export interface FinancialReport {
  title: ReactNode;
  desc: ReactNode;
  link: string;
  ability: string;
  subject: string;
  feature?: string;
}

export interface FinancialSection {
  sectionTitle: ReactNode;
  reports: FinancialReport[];
}

export function useFilterFinancialReports(
  financialSection: FinancialSection[],
) {
  const ability = useAbilityContext();
  const { featureCan } = useFeatureCan();

  const section = financialSection
    .map((section) => {
      const reports = section.reports.filter((report) => {
        const isFeatureCan = !report.feature || featureCan(report.feature);

        return isFeatureCan && ability.can(report.ability, report.subject);
      });

      return {
        sectionTitle: section.sectionTitle,
        reports,
      };
    })
    .filter(({ reports }) => !isEmpty(reports));

  return section;
}
