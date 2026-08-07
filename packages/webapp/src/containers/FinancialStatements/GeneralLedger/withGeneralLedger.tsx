import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getGeneralLedgerFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithGeneralLedgerProps {
  generalLedgerFilterDrawer: ReturnType<typeof getGeneralLedgerFilterDrawer>;
}

export const withGeneralLedger = <Props = unknown,>(
  mapState?: MapState<WithGeneralLedgerProps, Props>,
) => {
  const mapStateToProps: MapStateToProps<
    WithGeneralLedgerProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithGeneralLedgerProps = {
      generalLedgerFilterDrawer: getGeneralLedgerFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
