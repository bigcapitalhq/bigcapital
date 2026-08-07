import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getItemsTableStateFactory,
  isItemsTableStateChangedFactory,
} from '@/store/items/items.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithItemsProps {
  itemsSelectedRows: ApplicationState['items']['selectedRows'];
  itemsTableState: ReturnType<ReturnType<typeof getItemsTableStateFactory>>;
  itemsTableStateChanged: ReturnType<
    ReturnType<typeof isItemsTableStateChangedFactory>
  >;
}

export function withItems<Props = unknown>(
  mapState?: MapState<WithItemsProps, Props>,
) {
  const getItemsTableState = getItemsTableStateFactory();
  const isItemsTableStateChanged = isItemsTableStateChangedFactory();

  const mapStateToProps: MapStateToProps<
    WithItemsProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithItemsProps = {
      itemsSelectedRows: state.items.selectedRows,
      itemsTableState: getItemsTableState(state, props as never),
      itemsTableStateChanged: isItemsTableStateChanged(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithItemsProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
