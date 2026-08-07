import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getBalanceSheetFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithBalanceSheetProps {
  balanceSheetDrawerFilter: ReturnType<typeof getBalanceSheetFilterDrawer>;
}

export const withBalanceSheet = <Props = unknown,>(
  mapState?: MapState<WithBalanceSheetProps, Props>,
) => {
  const mapStateToProps: MapStateToProps<
    WithBalanceSheetProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithBalanceSheetProps = {
      balanceSheetDrawerFilter: getBalanceSheetFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
