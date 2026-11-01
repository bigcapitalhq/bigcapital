import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  isDrawerOpenFactory,
  getDrawerPayloadFactory,
} from '@/store/dashboard/dashboard.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithDrawersProps {
  isOpen: ReturnType<ReturnType<typeof isDrawerOpenFactory>>;
  payload: ReturnType<ReturnType<typeof getDrawerPayloadFactory>>;
}

export function withDrawers<
  Props extends { name: string },
  Mapped extends object = WithDrawersProps,
>(mapState?: MapState<WithDrawersProps, Props, Mapped>) {
  const isDrawerOpen = isDrawerOpenFactory();
  const getDrawerPayload = getDrawerPayloadFactory();

  const mapStateToProps: MapStateToProps<
    WithDrawersProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithDrawersProps = {
      isOpen: isDrawerOpen(state, props),
      payload: getDrawerPayload(state, props),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithDrawersProps)
      : mapped;
  };
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
}
