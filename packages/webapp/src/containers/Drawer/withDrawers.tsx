import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  isDrawerOpenFactory,
  getDrawerPayloadFactory,
} from '@/store/dashboard/dashboard.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithDrawersProps {
  isOpen: ReturnType<ReturnType<typeof isDrawerOpenFactory>>;
  payload: ReturnType<ReturnType<typeof getDrawerPayloadFactory>>;
}

export function withDrawers<Props extends { name: string }>(
  mapState?: MapState<WithDrawersProps, Props>,
) {
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
  return connect(mapStateToProps);
}
