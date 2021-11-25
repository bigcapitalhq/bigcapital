import { isEmpty } from 'lodash';
import { useAbilityContext } from '../../hooks';

function useFilterFinancialReports(financial) {
  const ability = useAbilityContext();

  const seaction = financial
    .map((seaction) => {
      const reports = seaction.reports.filter((report) => {
        return ability.can(report.ability, report.subject);
      });

      return {
        sectionTitle: seaction.sectionTitle,
        reports,
      };
    })
    .filter(({ reports }) => !isEmpty(reports));

  return seaction;
}

export default useFilterFinancialReports;
