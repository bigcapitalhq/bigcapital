import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  isAlertOpenFactory,
  getAlertPayloadFactory,
} from '@/store/dashboard/dashboard.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithAlertStoreConnectProps {
  isOpen: ReturnType<ReturnType<typeof isAlertOpenFactory>>;
  payload: ReturnType<ReturnType<typeof getAlertPayloadFactory>>;
}

export function withAlertStoreConnect<
  Mapped extends object = WithAlertStoreConnectProps,
>(mapState?: MapState<WithAlertStoreConnectProps, { name: string }, Mapped>) {
  const isAlertOpen = isAlertOpenFactory();
  const getAlertPayload = getAlertPayloadFactory();

  const mapStateToProps: MapStateToProps<
    WithAlertStoreConnectProps,
    { name: string },
    ApplicationState
  > = (state, props) => {
    const mapped: WithAlertStoreConnectProps = {
      isOpen: isAlertOpen(state, props),
      payload: getAlertPayload(state, props),
    };
    return mapState
      ? ({
          ...mapped,
          ...mapState(mapped, state, props),
        } as WithAlertStoreConnectProps)
      : mapped;
  };

  return function withAlertStoreConnectHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
}
