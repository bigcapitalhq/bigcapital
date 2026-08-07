import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  isAlertOpenFactory,
  getAlertPayloadFactory,
} from '@/store/dashboard/dashboard.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithAlertStoreConnectProps {
  isOpen: ReturnType<ReturnType<typeof isAlertOpenFactory>>;
  payload: ReturnType<ReturnType<typeof getAlertPayloadFactory>>;
}

export function withAlertStoreConnect<Props extends { name: string }>(
  mapState?: MapState<WithAlertStoreConnectProps>,
) {
  const isAlertOpen = isAlertOpenFactory();
  const getAlertPayload = getAlertPayloadFactory();

  const mapStateToProps: MapStateToProps<
    WithAlertStoreConnectProps,
    Props,
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
  return connect(mapStateToProps);
}
