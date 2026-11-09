import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import type { ComponentType } from 'react';
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

export const withVendors = <
  Props = unknown,
  Mapped extends object = WithVendorsProps,
>(
  mapState?: MapState<WithVendorsProps, Props, Mapped>,
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
