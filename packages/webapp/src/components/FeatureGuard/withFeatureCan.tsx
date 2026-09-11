import { connect } from 'react-redux';
import type { ComponentType } from 'react';
import { getDashboardFeaturesSelector } from '@/store/dashboard/dashboard.selectors';
import { ApplicationState } from '@/store/reducers';

type MapState<Props, Mapped> = (
  mapped: WithFeatureCanProps,
  state: ApplicationState,
  props: Props,
) => Mapped;

export interface WithFeatureCanProps {
  isFeatureCan: boolean;
  features: Record<string, unknown>;
}

export const withFeatureCan = <
  Props extends { feature?: string },
  Mapped extends object = WithFeatureCanProps,
>(
  mapState?: MapState<Props, Mapped>,
) => {
  const featuresSelector = getDashboardFeaturesSelector();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const features = featuresSelector(state) as Record<string, unknown>;

    const mapped: WithFeatureCanProps = {
      isFeatureCan: !!(props.feature && features[props.feature]),
      features,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
