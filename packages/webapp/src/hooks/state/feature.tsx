import React from 'react';
import { createSelector } from 'reselect';
import type { RootState } from '@/store/reducers';
import { setFeatureDashboardMeta } from '@/store/dashboard/dashboard.actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const featuresSelector = createSelector(
  (state: RootState) => state.dashboard.features,
  (features) => features,
);

export const useFeatureCan = () => {
  const features = useAppSelector(featuresSelector);

  return {
    featureCan: (feature: string) => {
      return !!features[feature];
    },
  };
};

/**
 * Sets features.
 */
export const useSetFeatureDashboardMeta = () => {
  const dispatch = useAppDispatch();

  return React.useCallback(
    (meta: { features: Array<{ name: string; isAccessible: boolean }> }) => {
      dispatch(setFeatureDashboardMeta({ features: meta.features }));
    },
    [dispatch],
  );
};
