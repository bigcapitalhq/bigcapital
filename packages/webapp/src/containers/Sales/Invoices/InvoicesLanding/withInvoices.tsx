import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  getInvoicesTableStateFactory,
  isInvoicesTableStateChangedFactory,
  getInvoicesSelectedRowsFactory,
} from '@/store/invoice/invoices.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithInvoicesProps {
  invoicesTableState: ReturnType<
    ReturnType<typeof getInvoicesTableStateFactory>
  >;
  invoicesTableStateChanged: ReturnType<
    ReturnType<typeof isInvoicesTableStateChangedFactory>
  >;
  invoicesSelectedRows: ReturnType<
    ReturnType<typeof getInvoicesSelectedRowsFactory>
  >;
}

export const withInvoices = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithInvoicesProps,
>(
  mapState?: MapState<WithInvoicesProps, Props, Mapped>,
) => {
  const getInvoicesTableState = getInvoicesTableStateFactory();
  const isInvoicesTableStateChanged = isInvoicesTableStateChangedFactory();
  const getSelectedRows = getInvoicesSelectedRowsFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithInvoicesProps = {
      invoicesTableState: getInvoicesTableState(state, props),
      invoicesTableStateChanged: isInvoicesTableStateChanged(state),
      invoicesSelectedRows: getSelectedRows(state),
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
