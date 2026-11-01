import { connect, MapStateToProps } from 'react-redux';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';

export interface WithCurrentViewProps {
  currentViewId: string | number | undefined;
}

interface WithCurrentViewOwnProps {
  match: { params: { custom_view_id: string | number | undefined } };
}

const mapStateToProps: MapStateToProps<
  WithCurrentViewProps,
  WithCurrentViewOwnProps,
  ApplicationState
> = (_state, props) => ({
  currentViewId: props.match.params.custom_view_id,
});

export function withCurrentView<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithCurrentViewProps>> {
  const Connected = connect(mapStateToProps)(
    WrappedComponent as ComponentType<any>,
  );
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithCurrentViewProps>
  >;
}
