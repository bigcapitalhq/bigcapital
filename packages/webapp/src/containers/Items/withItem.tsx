import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';
import { getItemById } from '@/store/selectors';

export interface WithItemProps {
  item: ReturnType<typeof getItemById>;
}

interface WithItemOwnProps {
  itemId: string | number;
}

export function withItem<
  Props extends WithItemOwnProps = WithItemOwnProps,
  Mapped extends object = WithItemProps,
>(mapState?: MapState<WithItemProps, Props, Mapped>) {
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
}
