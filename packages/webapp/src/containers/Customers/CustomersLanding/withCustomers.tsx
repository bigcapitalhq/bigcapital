import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import type { ComponentType } from 'react';
import {
  getCustomersTableStateFactory,
  customersTableStateChangedFactory,
} from '@/store/customers/customers.selectors';

export interface WithCustomersProps {
  customersSelectedRows: ApplicationState['customers']['selectedRows'];
  customersTableState: ReturnType<
    ReturnType<typeof getCustomersTableStateFactory>
  >;
  customersTableStateChanged: ReturnType<
    ReturnType<typeof customersTableStateChangedFactory>
  >;
}

export const withCustomers = <
  Props = unknown,
  Mapped extends object = WithCustomersProps,
>(
  mapState?: MapState<WithCustomersProps, Props, Mapped>,
) => {
  const getCustomersTableState = getCustomersTableStateFactory();
  const customersTableStateChanged = customersTableStateChangedFactory();

  const mapStateToProps: MapStateToProps<
    WithCustomersProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithCustomersProps = {
      customersSelectedRows: state.customers.selectedRows,
      customersTableState: getCustomersTableState(state, props as never),
      customersTableStateChanged: customersTableStateChanged(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithCustomersProps)
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
