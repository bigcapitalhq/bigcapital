import { useCallback, useMemo } from 'react';
import { useDashboardMeta } from '../query/users/queries';

/**
 * Retrieves the dashboard features accessibility.
 */
export const useFeatureCan = () => {
  const { data: dashboardMeta } = useDashboardMeta();

  const features = useMemo(() => {
    return (dashboardMeta?.features ?? []).reduce<Record<string, boolean>>(
      (featuresMap, feature) => {
        featuresMap[feature.name] = feature.isAccessible;
        return featuresMap;
      },
      {},
    );
  }, [dashboardMeta?.features]);

  const featureCan = useCallback(
    (feature: string) => !!features[feature],
    [features],
  );

  return { featureCan };
};
