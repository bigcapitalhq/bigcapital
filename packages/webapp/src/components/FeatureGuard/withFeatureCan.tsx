// @ts-nocheck
import { connect } from 'react-redux';
import { getDashboardFeaturesSelector } from '@/store/dashboard/dashboard.selectors';

export const withFeatureCan = (mapState) => {
  const featuresSelector = getDashboardFeaturesSelector();

  const mapStateToProps = (state, props) => {
    const features = featuresSelector(state);

    const mapped = {
      isFeatureCan: !!features[props.feature],
      features,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
