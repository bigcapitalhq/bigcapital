import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

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
