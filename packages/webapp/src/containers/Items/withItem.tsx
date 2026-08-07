import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { ApplicationState } from '@/store/reducers';
import { getItemById } from '@/store/selectors';

export interface WithItemProps {
  item: ReturnType<typeof getItemById>;
}

interface WithItemOwnProps {
  itemId: string | number;
}

export function withItem<Props extends WithItemOwnProps = WithItemOwnProps>(
  mapState?: MapState<WithItemProps, Props>,
) {
  const mapStateToProps: MapStateToProps<
    WithItemProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithItemProps = {
      item: getItemById(
        state as unknown as Record<string, unknown>,
        props.itemId,
      ),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithItemProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
