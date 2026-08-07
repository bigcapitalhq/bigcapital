import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getInventoryItemDetailsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithInventoryItemDetailsProps {
  inventoryItemDetailDrawerFilter: ReturnType<
    typeof getInventoryItemDetailsFilterDrawer
  >;
}

export const withInventoryItemDetails = <Props = unknown,>(
  mapState?: MapState<WithInventoryItemDetailsProps, Props>,
) => {
  const mapStateToProps: MapStateToProps<
    WithInventoryItemDetailsProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithInventoryItemDetailsProps = {
      inventoryItemDetailDrawerFilter:
        getInventoryItemDetailsFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
