import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getPurchasesByItemsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithPurchasesByItemsProps {
  purchasesByItemsDrawerFilter: ReturnType<
    typeof getPurchasesByItemsFilterDrawer
  >;
}

export const withPurchasesByItems = <Props,>(
  mapState?: MapState<WithPurchasesByItemsProps, Props>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithPurchasesByItemsProps = {
      purchasesByItemsDrawerFilter: getPurchasesByItemsFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
