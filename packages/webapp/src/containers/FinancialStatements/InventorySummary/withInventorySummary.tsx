import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getInventorySummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithInventorySummaryProps {
  inventorySummaryDrawerFilter: ReturnType<
    typeof getInventorySummaryFilterDrawer
  >;
}

export const withInventorySummary = <
  Props,
  Mapped extends object = WithInventorySummaryProps,
>(
  mapState?: MapState<WithInventorySummaryProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithInventorySummaryProps = {
      inventorySummaryDrawerFilter: getInventorySummaryFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
