// @ts-nocheck
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { setFeatureDashboardMeta } from '@/store/dashboard/dashboard.actions';

const featuresSelector = createSelector(
  (state) => state.dashboard.features,
  (features) => features,
);

export const useFeatureCan = () => {
  const features = useSelector(featuresSelector);

  return {
    featureCan: (feature) => {
      return !!features[feature];
    },
  };
};

/**
 * Sets features.
 */
export const useSetFeatureDashboardMeta = () => {
  const dispatch = useDispatch();

  return React.useCallback(
    (features) => {
      dispatch(setFeatureDashboardMeta(features));
    },
    [dispatch],
  );
};
