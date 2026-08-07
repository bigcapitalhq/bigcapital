import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import {
  getVendorsTableStateFactory,
  vendorsTableStateChangedFactory,
} from '@/store/vendors/vendors.selectors';

export interface WithVendorsProps {
  vendorsSelectedRows: ApplicationState['vendors']['selectedRows'];
  vendorsTableState: ReturnType<ReturnType<typeof getVendorsTableStateFactory>>;
  vendorsTableStateChanged: ReturnType<
    ReturnType<typeof vendorsTableStateChangedFactory>
  >;
}

export const withVendors = <Props = unknown,>(
  mapState?: MapState<WithVendorsProps, Props>,
) => {
  const getVendorsTableState = getVendorsTableStateFactory();
  const vendorsTableStateChanged = vendorsTableStateChangedFactory();

  const mapStateToProps: MapStateToProps<
    WithVendorsProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithVendorsProps = {
      vendorsSelectedRows: state.vendors.selectedRows,
      vendorsTableState: getVendorsTableState(state, props as never),
      vendorsTableStateChanged: vendorsTableStateChanged(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithVendorsProps)
      : mapped;
  };
  return connect(mapStateToProps);
};
