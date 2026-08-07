import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getSalesByItemsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithSalesByItemsProps {
  salesByItemsDrawerFilter: ReturnType<typeof getSalesByItemsFilterDrawer>;
}

export const withSalesByItems = <Props,>(
  mapState?: MapState<WithSalesByItemsProps, Props>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithSalesByItemsProps = {
      salesByItemsDrawerFilter: getSalesByItemsFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
